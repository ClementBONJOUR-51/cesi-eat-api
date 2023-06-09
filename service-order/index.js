const mongoose = require('mongoose');
const con = require('./connexion_mongoDB');
const routerOrder = require('./routes/order.route');
const routerProduct = require('./routes/product.route');
const routerRestorant = require('./routes/restorant.route');
const os = require("os");


const express = require('express');
const app = express();
app.use(express.json());

const port = 3000;

app.use(routerOrder);
app.use(routerProduct);
app.use(routerRestorant);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


