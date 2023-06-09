const express = require("express");
const os = require("os");
const mysql = require("mysql2");
// Obtain the connection to the database
const database = require("./connexion_mysql");
const connection = database.getConnection();
const routerUser = require("./routes/user.route");
const routerAddress = require("./routes/address.route");
const routerRole = require("./routes/role.route");
const cors = require("cors");



// Use the connection to execute queries, for example:
// connection.query("SELECT * FROM Users", (err, results) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(results);
// });



const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

var cpuUsage = null;

app.get("/login", (req, res) => {
  res.send("Login ✅");
});

app.get("/getCPU", (req, res) => {
  res.send({ cpu: cpuUsage });
});

app.use(routerUser);
app.use(routerAddress);
app.use(routerRole);


app.listen(port, () => {
  console.log(`Authentication service is running on http://servicex:${port}`);

  setInterval(() => {
    cpuUsage = os.loadavg()[0];
  }, 10000);
});
