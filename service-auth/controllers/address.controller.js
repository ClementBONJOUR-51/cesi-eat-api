const database = require("../connexion_mysql"); // importation de la connexion à la base de données
const con = database.getConnection();
const express = require("express");
const app = express();
const Address = require("../models/address.model.js");

Address.findAll = (req, res) => {
  // Pour afficher tous les utilisateurs
  con.query(
    "SELECT * FROM `cesi`.`Address` WHERE date_out IS NULL ",
    (err, result) => {
      if (err) {
        res.send({
          status: "error",
          message: "Les données sont incorrectes !",
          error: err,
        });
        // console.log(err);
      } else {
        if (result.length == 0) {
          res.send({
            status: "error",
            message: "Les adresses n'ont pas été trouvées ! ",
          });
        } else {
          const totalCount = result.length; // Nombre total de résultats
          res.setHeader("X-Total-Count", totalCount); // Définition de l'en-tête "X-Total-Count"
          res.send({ status: "success", result: result });
        }
      }
    }
  );
};

Address.findOne = (req, res) => {
  // Pour afficher un utilisateur
  con.query(
    "SELECT * FROM `cesi`.`Address` WHERE id = ? AND date_out IS NULL",
    req.params.id,
    (err, result) => {
      if (err) {
        res.send({
          status: "error",
          message: "Les données sont incorrectes !",
          error: err,
        });
        // console.log(err);
      } else {
        if (result.length == 0) {
          res.send({
            status: "error",
            message: "L'adresse n'a pas été trouvée ! ",
          });
        } else {
          res.send({ status: "success", result: result });
        }
      }
    }
  );
};

Address.create = (req, res) => {
  // créer un utilisateur
  con.query("INSERT INTO `cesi`.`Address` SET ?", req.body, (err, result) => {
    if (err) {
      res.send({
        status: "error",
        message: "Les données sont incorrectes !",
        error: err,
      });
      // console.log(err);
    } else {
      if (result.length == 0) {
        res.send({
          status: "error",
          message: "L'adresse n'a pas pu être ajoutée ! ",
        });
      } else {
        res.send({ status: "success", result: result });
      }
    }
  });
};

Address.update = (req, res) => {
  // modifier un utilisateur
  const data = [
    req.body.postal_code,
    req.body.street,
    req.body.city,
    req.body.street_number,
    req.body.lati,
    req.body.longi,
    req.params.id,
  ];
  con.query(
    "UPDATE `cesi`.`Address` SET `postal_code`=?, `street`=?, `city`=?, `street_number`=?, `lati`=?, `longi`=? WHERE `id`=?",
    data,
    (err, result) => {
      if (err) {
        res.send({
          status: "error",
          message: "Les données sont incorrectes !",
          error: err,
        });
        // console.log(err);
      } else {
        if (result.length == 0) {
          res.send({
            status: "error",
            message: "L'adresse est introuvable ! ",
          });
        } else {
          res.send({ status: "success", result: result });
        }
      }
    }
  );
};

Address.delete = (req, res) => {
  // supprimer un utilisateur avec date_in date_out.
  con.query(
    "UPDATE `cesi`.`Address` SET `date_out`= NOW() WHERE `id`=?",
    req.params.id,
    (err, result) => {
      if (err) {
        res.send({
          status: "error",
          message: "Les données sont incorrectes !",
          error: err,
        });
        // console.log(err);
      } else {
        if (result.length == 0) {
          res.send({
            status: "error",
            message: "L'adresse est introuvable ! ",
          });
        } else {
          res.send({ status: "success", result: result });
        }
      }
    }
  );
};

module.exports = Address;
