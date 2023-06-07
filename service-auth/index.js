const express = require("express");
const os = require("os");
const mysql = require("mysql2");
// Obtain the connection to the database
const database = require("./connexion_mysql");
const connection = database.getConnection();
const routerUser = require("./routes/user.route");

// Use the connection to execute queries, for example:
// connection.query("SELECT * FROM Users", (err, results) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(results);
// });



const app = express();
const port = 3000;

var cpuUsage = null;

app.get("/login", (req, res) => {
  res.send("Login ✅");
});

app.get("/getCPU", (req, res) => {
  res.send({ cpu: cpuUsage });
});

app.use(express.json());
app.use(routerUser);


app.listen(port, () => {
  console.log(`Authentication service is running on http://servicex:${port}`);

  setInterval(() => {
    cpuUsage = os.loadavg()[0];
  }, 10000);
});
