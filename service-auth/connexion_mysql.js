const mysql = require("mysql2");

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: "mysql",
      user: "user",
      password: "password",
      port: "3306",
      database: "cesi",
    });

    this.connect();
  }

  connect() {
    this.connection.connect((err) => {
      if (err) {
        console.log("Not connected");
        console.log(err);
      } else {
        console.log("Connected");
      }
    });
  }

  getConnection() {
    return this.connection;
  }
}

// Create and export a single instance of the class
const database = new Database();
module.exports = database;