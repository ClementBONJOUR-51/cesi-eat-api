const express = require('express');
const app = express();
var cors = require('cors')

const init = require('./api/routes/init');

app.use('/init',cors(), init);

module.exports = app;

