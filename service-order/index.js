const mongoose = require('mongoose');
const con = require('./connexion_mongoDB');
const routerOrder = require('./routes/order.route');
const routerProduct = require('./routes/product.route');
const routerRestorant = require('./routes/restorant.route');
const routerMenu = require('./routes/menu.route');
const routerNotification = require('./routes/notification.route');
const os = require("os");
const cors = require("cors");

const express = require('express');
const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;
var cpuUsage = null;

app.use(routerOrder);
app.use(routerProduct);
app.use(routerRestorant);
app.use(routerMenu);
app.use(routerNotification);
app.get("/getCPU", (req, res) => {
    res.send({ cpu: cpuUsage });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
    setInterval(() => {
        cpuUsage = os.loadavg()[0];
    }, 10000);
}
);