const express = require('express');
const os = require('os');
const mysql = require("mysql");
const axios = require('axios');


const app = express();
const port = 3000;

var cpuUsage = null



app.get("/login", (req, res) => {
  res.send('Login ✅');
});

app.get('/getCPU', (req, res) => {
  res.send('Réponse du SERVEUR avec charge CPU ' + cpuUsage + " ✅");
});



app.listen(port, () => {
  console.log(`Authentication service is running on http://servicex:${port}`);

  const url = 'http://main_server:3000/register';


  setInterval(() => {
    cpuUsage = os.loadavg()[0];
  }, 10000);
});