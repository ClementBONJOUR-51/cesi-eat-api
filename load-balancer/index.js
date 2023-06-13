const { Server } = require('./Service');
const { LoadBalancer } = require('./LoadBalancer');

const servers = [
  // new Server('https://cesi-eat-app-1-test.glitch.me', ["/login","/token"]),
  // new Server('https://cesi-eat-app-2-test.glitch.me', ["/login","/token"]),
  // new Server('https://cesi-eat-app-3-test.glitch.me', ["/orders","/order"])
];

const loadBalancer = new LoadBalancer(3000, 10, 5);

servers.forEach((server) => {
  loadBalancer.addServer(server);
});

loadBalancer.start();