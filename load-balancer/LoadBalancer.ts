import Server from './Service';
import { createProxyMiddleware } from 'http-proxy-middleware';
import express, { Express, Request, Response, NextFunction } from 'express';
const cors = require('cors');

export class LoadBalancer {
    private _servers: Server[];
    private _appExpress: Express;
    private _port: number;
    private _healthCheckingInterval: number;
    private _maxWaitTime: number;

    constructor(port: number = 3000, healthCheckingInterval: number = 10, maxWaitTime: number = 5) {
        this._servers = [];
        this._appExpress = express();
        this._port = port;
        this._healthCheckingInterval = healthCheckingInterval * 1000;
        this._maxWaitTime = maxWaitTime * 1000;
    }

    public addServer(server: Server): void {
        this._servers.push(server);
    }

    public removeServer(server: Server): void {
        this._servers = this._servers.filter(s => s !== server);
    }

    public get servers(): Server[] {
        return this._servers;
    }

    public getAllRoutes(servers: Server[]): string[] {
        const allRoutes: Set<string> = new Set();

        servers.forEach((server: Server) => {
            const routes: string[] = server.getRoutes();
            routes.forEach((route: string) => {
                allRoutes.add(route);
            });
        });

        return Array.from(allRoutes);
    }

    private generateRoutes = () => {
        const exludeRoutes: string[] = ['/register', '/unregister', '/getServers'];

        // Supprimer toutes les routes existantes
        this._appExpress._router?.stack.forEach((layer: any, index: number, routes: any[]) => {
            if (layer.route) {
                const routePath = layer.route.path;
                // Vérifier si la route est exclue
                if (!exludeRoutes.includes(routePath)) {
                    routes.splice(index, 1); // Supprimer la route
                }
            }
        });

        this.getAllRoutes(this._servers).forEach((route: string) => {
            this._appExpress.use(route, (req: Request, res: Response, next: NextFunction) => {
                const targetServer: Server | null = this.chooseServer(route);
                if (targetServer) {
                    createProxyMiddleware({
                        target: targetServer.url,
                        changeOrigin: true,
                        onProxyReq: (proxyReq, req, res) => {
                            if (req.body) {
                                const bodyData = JSON.stringify(req.body);
                                proxyReq.setHeader('Content-Type', 'application/json');
                                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                                proxyReq.write(bodyData);
                            }
                        }
                    })(req, res, (error) => {
                        console.error('Erreur lors de la redirection vers le serveur:', error);
                        res.status(500).send('Erreur lors de la redirection vers le serveur');
                    });
                }
            });
        });
    }


    public start(): void {
        this._appExpress.use(express.json());
        this._appExpress.use(cors());
        this._appExpress.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.header("Access-Control-Allow-Methods", "GET");

            if (req.method === "OPTIONS") return res.status(200).json({});

            next();
        });


        this.getAllRoutes(this._servers).forEach((route: string) => {
            console.log(`Route ${route} added`);
        });

        this.generateRoutes();

        this._appExpress.use('/getServers', (req: Request, res: Response, next: NextFunction) => {
            res.json(this._servers);
        });

        this._appExpress.post("/register", (req: Request, res: Response, next: NextFunction) => {
            console.log(req.body)
            const url = req.body.url as string;
            const routes: string[] = req.body.routes as string[];
            if (!url || !routes) {
                res.status(400).send('Paramètres manquants');
                return;
            }

            // Vérifier si l'URL du serveur existe déjà
            const existingServer = this._servers.find(server => server.url === url);
            if (existingServer) {
                // console.log('Serveur déjà existant');
                res.status(409).send('Serveur déjà existant');
                return;
            }

            const server: Server = new Server(url, routes);
            this.addServer(server);
            res.status(200).send('Serveur enregistré');
            this.generateRoutes();

            // Update routes after registering a new server
            this.generateRoutes();
        });

        this._appExpress.post("/unregister", (req: Request, res: Response, next: NextFunction) => {
            const url: string = req.body.url as string;
            if (!url) {
                res.status(400).send('Paramètres manquants');
                return;
            }
            const server: Server | undefined = this._servers.find(s => s.url === url);
            if (!server) {
                res.status(404).send('Serveur non trouvé');
                return;
            }
            this.removeServer(server);
            res.status(200).send('Serveur supprimé');

            // Update routes after unregistering a server
            this.generateRoutes();
        });


        this._appExpress.listen(this._port, () => {
            console.log(`Load balancer listening on port ${this._port}`);
        });

        // this.getCPU();
        setInterval(this.getCPU, this._healthCheckingInterval);
        // setInterval(this.printLog, 2000);


    }


    private chooseServer = (route: string): Server | null => {
        let selectedServer: Server | null = null;
        let minCPU: number | null = null;

        // Recherche du serveur avec le moins de charge CPU
        for (const server of this.servers) {
            if (server.getRoutes().includes(route)) {
                if ((minCPU === null || server.cpu < minCPU) && server.status === 'GOOD') {
                    minCPU = server.cpu;
                    selectedServer = server;
                }
            }
        }
        return selectedServer;
    }

    private getCPU = async (): Promise<void> => {
        const promises = this._servers.map((server) => server.updateCPU(this._maxWaitTime));
        await Promise.allSettled(promises);
    };

    private printLog = (): void => {
        process.stdout.moveCursor(0, -3);
        this._servers.forEach((server) => {
            process.stdout.clearLine(0);
            process.stdout.write(server.getPrint());
        });
    };
}