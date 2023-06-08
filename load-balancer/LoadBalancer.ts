import Server from './Server';
import express, { Express, Request, Response, NextFunction } from 'express';
import httpProxy from 'http-proxy';
import { createProxyMiddleware } from 'http-proxy-middleware';



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

    public start(): void {
        this._appExpress.use(express.json()); // Ajouter ce middleware pour analyser le corps en tant que JSON

        const generateRoutes = () => {
            const allRoutes = new Set<string>(this.getAllRoutes(this._servers));

            const excludedRoutes = ['/register', '/unregister'];

            // Remove existing routes (excluding excludedRoutes)
            this._appExpress._router.stack = this._appExpress._router.stack.filter((layer: any) => {
                if (layer.route) {
                    const path = layer.route.path;
                    if (!excludedRoutes.includes(path)) {
                        allRoutes.add(path);
                        return false;
                    }
                }
                return true;
            });


            // Créer une instance de httpProxy
            const proxy = httpProxy.createProxyServer({});

            // Générer les nouvelles routes avec la redirection personnalisée
            this.servers.forEach((server: Server) => {
                server.getRoutes().forEach((route: string) => {
                    const selectedServer = this.chooseServer(route);
                    if (selectedServer) {
                        this._appExpress.use(
                            route,
                            createProxyMiddleware({
                                target: selectedServer.url,
                                changeOrigin: true,
                                onProxyReq: (proxyReq, req, res) => {
                                    if (req.body) {
                                        const bodyData = JSON.stringify(req.body);
                                        proxyReq.setHeader('Content-Type', 'application/json');
                                        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                                        proxyReq.write(bodyData);
                                    }
                                },
                            })
                        );
                    }
                });
            });

            const existingRoutes = Array.from(allRoutes);
            console.log('Existing routes:', existingRoutes);
        };


        this._appExpress.post("/register", (req: Request, res: Response, next: NextFunction) => {
            const ip = req.body.url as string;
            const routes: string[] = req.body.routes as string[];
            if (!ip || !routes) {
                res.status(400).send('Paramètres manquants');
                return;
            }
            const server: Server = new Server(ip, routes);
            this.addServer(server);
            res.status(200).send('Serveur enregistré');

            // Update routes after registering a new server
            generateRoutes();

        });

        this._appExpress.post("/unregister", (req: Request, res: Response, next: NextFunction) => {
            const url: string = req.query.url as string;
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
            generateRoutes();
        });


        this._appExpress.listen(this._port, () => {
            console.log('Server running on port ' + this._port + ' ✅\n\n\n');
        });

        this.getCPU();
        setInterval(() => this.getCPU(), this._healthCheckingInterval);
        //setInterval(() => this.printLog(), 1000);
    }

    private chooseServer = (route: string): Server | null => {
        let selectedServer: Server | null = null;
        let minCPU: number | null = null;

        // Recherche du serveur avec le moins de charge CPU
        for (const server of this.servers) {
            if (server.getRoutes().includes(route)) {
                if (minCPU === null || server.cpu < minCPU) {
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