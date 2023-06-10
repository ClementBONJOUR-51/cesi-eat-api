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
        console.error("Not connected");
        console.error(err);
        throw new Error("Failed to connect to the database"); // Génère une erreur et arrête l'exécution du serveur Node
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
