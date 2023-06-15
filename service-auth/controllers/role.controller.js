const database = require("../connexion_mysql"); // importation de la connexion à la base de données
const con = database.getConnection();
const express = require("express");
const app = express();
const Role = require("../models/role.model.js");

Role.findAll = (req, res) => {
  // Pour afficher tous les utilisateurs
  con.query(
    "SELECT * FROM `cesi`.`Roles` WHERE date_out IS NULL ",
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
            message: "Les rôles utilisateurs n'ont pas été trouvés ! ",
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

Role.findOne = (req, res) => {
  // Pour afficher un utilisateur
  con.query(
    "SELECT * FROM `cesi`.`Roles` WHERE id = ? AND date_out IS NULL",
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
            message: "Le rôle utilisateur n'a pas été trouvé ! ",
          });
        } else {
          res.send({ status: "success", result: result });
        }
      }
    }
  );
};

Role.create = (req, res) => {
  // créer un utilisateur
  con.query("INSERT INTO `cesi`.`Roles` SET ?", req.body, (err, result) => {
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
          message: "Le rôle utilisateur n'a pas pu être créé ! ",
        });
      } else {
        res.send({ status: "success", result: result });
      }
    }
  });
};

Role.update = (req, res) => {
  // modifier un utilisateur
  const data = [
    req.body.customer,
    req.body.delivery_person,
    req.body.restorant,
    req.body.administrator,
    req.body.sales_department,
    req.body.technical_department,
    req.body.developer_tier,
    req.params.id,
  ];
  con.query(
    "UPDATE `cesi`.`Roles` SET `customer`=?, `delivery_person`=?, `restorant`=?, `administrator`=?, `sales_department`=?, `technical_department`=?, `developer_tier`=? WHERE `id`=?",
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
            message: "Le rôle utilisateur n'a pas pu être mis à jour ! ",
          });
        } else {
          res.send({ status: "success", result: result });
        }
      }
    }
  );
};

Role.delete = (req, res) => {
  // supprimer un utilisateur avec date_in date_out.
  con.query(
    "UPDATE `cesi`.`Roles` SET `date_out`= NOW() WHERE `id`=?",
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
            message: "Le rôle utilisateur est introuvable ! ",
          });
        } else {
          res.send({ status: "success", result: result });
        }
      }
    }
  );
};

module.exports = Role;
