"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadBalancer = void 0;
const Server_1 = __importDefault(require("./Server"));
const express_1 = __importDefault(require("express"));
const http_proxy_1 = __importDefault(require("http-proxy"));
class LoadBalancer {
    constructor(port = 3000, healthCheckingInterval = 10, maxWaitTime = 5) {
        this.chooseServer = (route) => {
            let selectedServer = null;
            let minCPU = null;
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
        };
        this.redirectRequest = (req, res, targetServer) => {
            const proxy = http_proxy_1.default.createProxyServer({});
            proxy.on('error', (error) => {
                console.error('Erreur lors de la redirection vers le serveur:', error);
                targetServer.status = 'DOWN';
                this.getCPU().then(() => {
                    const newNextTarget = this.chooseServer(req.originalUrl);
                    if (newNextTarget) {
                        this.redirectRequest(req, res, newNextTarget);
                    }
                    else {
                        // Aucun serveur disponible avec la route spécifiée
                        res.status(500).send('Aucun serveur disponible pour traiter la requête.');
                    }
                });
            });
            const targetOptions = {
                target: targetServer.url,
                changeOrigin: true
            };
            proxy.web(req, res, targetOptions);
        };
        this.getCPU = () => __awaiter(this, void 0, void 0, function* () {
            const promises = this._servers.map((server) => server.updateCPU(this._maxWaitTime));
            yield Promise.allSettled(promises);
        });
        this.printLog = () => {
            process.stdout.moveCursor(0, -3);
            this._servers.forEach((server) => {
                process.stdout.clearLine(0);
                process.stdout.write(server.getPrint());
            });
        };
        this._servers = [];
        this._appExpress = (0, express_1.default)();
        this._port = port;
        this._healthCheckingInterval = healthCheckingInterval * 1000;
        this._maxWaitTime = maxWaitTime * 1000;
    }
    addServer(server) {
        this._servers.push(server);
    }
    removeServer(server) {
        this._servers = this._servers.filter(s => s !== server);
    }
    get servers() {
        return this._servers;
    }
    getAllRoutes(servers) {
        const allRoutes = new Set();
        servers.forEach((server) => {
            const routes = server.getRoutes();
            routes.forEach((route) => {
                allRoutes.add(route);
            });
        });
        return Array.from(allRoutes);
    }
    start() {
        // Function to generate middleware for each route
        const generateMiddleware = () => {
            const excludedRoutes = ['/register', '/unregister'];
            this._appExpress._router.stack = this._appExpress._router.stack.filter((layer) => {
                if (layer.route) {
                    return excludedRoutes.includes(layer.route.path);
                }
                return true;
            });
            this.getAllRoutes(this._servers).forEach((route) => {
                this._appExpress.use(route, (req, res, next) => {
                    const nextTarget = this.chooseServer(route);
                    if (!nextTarget) {
                        console.error('Tous les serveurs ' + route + ' sont indisponibles');
                        res.status(500).send('Tous les serveurs ' + route + ' sont indisponibles');
                        return;
                    }
                    this.redirectRequest(req, res, nextTarget);
                });
            });
        };
        this._appExpress.use(express_1.default.json()); // Ajouter ce middleware pour analyser le corps de la requête en tant que JSON
        this._appExpress.post("/register", (req, res, next) => {
            const ip = req.body.url;
            const routes = req.body.routes;
            console.log(routes, ip);
            if (!ip || !routes) {
                res.status(400).send('Paramètres manquants');
                return;
            }
            const server = new Server_1.default(ip, routes);
            this.addServer(server);
            res.status(200).send('Serveur enregistré');
            // Update routes after registering a new server
            generateMiddleware();
        });
        this._appExpress.post("/unregister", (req, res, next) => {
            const url = req.query.url;
            if (!url) {
                res.status(400).send('Paramètres manquants');
                return;
            }
            const server = this._servers.find(s => s.url === url);
            if (!server) {
                res.status(404).send('Serveur non trouvé');
                return;
            }
            this.removeServer(server);
            res.status(200).send('Serveur supprimé');
            // Update routes after unregistering a server
            generateMiddleware();
        });
        this._appExpress.listen(this._port, () => {
            console.log('Server running on port ' + this._port + ' ✅\n\n\n');
        });
        this.getCPU();
        setInterval(() => this.getCPU(), this._healthCheckingInterval);
        //setInterval(() => this.printLog(), 1000);
    }
}
exports.LoadBalancer = LoadBalancer;
