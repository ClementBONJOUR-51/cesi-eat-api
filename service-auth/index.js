const express = require('express');
const os = require('os');
const mysql = require("mysql");


const app = express();
const port = 3000;

var cpuUsage = null

app.get("/login", (req, res) => {
  res.send('Login ✅');
});

app.get('/getCPU', (req, res) => {
  res.send({ cpu: cpuUsage });
});



app.listen(port, () => {
  console.log(`Authentication service is running on http://servicex:${port}`);

  setInterval(() => {
    cpuUsage = os.loadavg()[0];
  }, 10000);
});