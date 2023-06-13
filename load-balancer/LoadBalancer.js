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
const Service_1 = __importDefault(require("./Service"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const express_1 = __importDefault(require("express"));
const cors = require('cors');
class LoadBalancer {
    constructor(port = 3000, healthCheckingInterval = 10, maxWaitTime = 5) {
        this.generateRoutes = () => {
            var _a;
            const exludeRoutes = ['/register', '/unregister', '/getServers'];
            // Supprimer toutes les routes existantes
            (_a = this._appExpress._router) === null || _a === void 0 ? void 0 : _a.stack.forEach((layer, index, routes) => {
                if (layer.route) {
                    const routePath = layer.route.path;
                    // Vérifier si la route est exclue
                    if (!exludeRoutes.includes(routePath)) {
                        routes.splice(index, 1); // Supprimer la route
                    }
                }
            });
            this.getAllRoutes(this._servers).forEach((route) => {
                this._appExpress.use(route, (req, res, next) => {
                    const targetServer = this.chooseServer(route);
                    if (targetServer) {
                        (0, http_proxy_middleware_1.createProxyMiddleware)({
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
        };
        this.chooseServer = (route) => {
            let selectedServer = null;
            let minCPU = null;
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
        this._appExpress.use(express_1.default.json());
        this._appExpress.use(cors());
        this._appExpress.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.header("Access-Control-Allow-Methods", "GET");
            if (req.method === "OPTIONS")
                return res.status(200).json({});
            next();
        });
        this.getAllRoutes(this._servers).forEach((route) => {
            console.log(`Route ${route} added`);
        });
        this.generateRoutes();
        this._appExpress.use('/getServers', (req, res, next) => {
            res.json(this._servers);
        });
        this._appExpress.post("/register", (req, res, next) => {
            console.log(req.body);
            const url = req.body.url;
            const routes = req.body.routes;
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
            const server = new Service_1.default(url, routes);
            this.addServer(server);
            res.status(200).send('Serveur enregistré');
            this.generateRoutes();
            // Update routes after registering a new server
            this.generateRoutes();
        });
        this._appExpress.post("/unregister", (req, res, next) => {
            const url = req.body.url;
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
            this.generateRoutes();
        });
        this._appExpress.listen(this._port, () => {
            console.log(`Load balancer listening on port ${this._port}`);
        });
        this.getCPU();
        setInterval(this.getCPU, this._healthCheckingInterval);
        // setInterval(this.printLog, 2000);
    }
}
exports.LoadBalancer = LoadBalancer;
