const { Server } = require('./Server');
const { LoadBalancer } = require('./LoadBalancer');

const servers = [
  // new Server('http://server1:3000', ['/login', '/token']),
  // new Server('http://server2:3000', ['/login', '/token', '/Orders', '/Orders:{id}']),
  // new Server('http://server3:3000', ['/Orders', '/Orders:{id}']),
];

const loadBalancer = new LoadBalancer(3000, 10, 5);

servers.forEach((server) => {
  loadBalancer.addServer(server);
});

loadBalancer.start();