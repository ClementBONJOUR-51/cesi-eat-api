const database = require("../connexion_mysql"); // importation de la connexion à la base de données
const con = database.getConnection();
const express = require('express');
const app = express();
const User = require('../models/user.model.js');
app.use(express.json());
const jwt = require('jsonwebtoken');
const config = require('../config');

User.findAll = (req, res) => {
    con.query('SELECT * FROM cesi.Users WHERE date_out IS NULL', (err, result) => {
      if (err) {
        res.send('error');
        console.log(err);
      } else {
        const totalCount = result.length; // Nombre total de résultats
        res.setHeader('X-Total-Count', totalCount); // Définition de l'en-tête "X-Total-Count"
        res.send(result);
      }
    });
  };

User.findOne = (req, res) => { // Pour afficher un utilisateur
    con.query('SELECT * FROM `cesi`.`Users` WHERE id = ? AND date_out IS NULL', req.params.id, (err, result) => {
        if (err){
            res.send('error');
            console.log(err);
        }else{
            res.send(result);
        }
});
};

// User.create = (req, res) => { // créer un utilisateur
//     con.query('INSERT INTO `cesi`.`Users` SET ?', req.body, (err, result) => {
//         if (err){
//             res.send('error');
//         }
//         else{
//             res.send(result);
//         }
//     }
//     );
//    // res.send({message: "create user"});
// };

// Créer adresse et l'utilisateur en retournant l'id de la table adresse nouvellement créée dans la table utilisateur
User.create = (req, res) => {
    const addressData = {
      postal_code: req.body.postal_code,
      street: req.body.street,
      city: req.body.city,
      street_number: req.body.street_number,
      lati: req.body.lati,
      longi: req.body.longi
    };
  
    // Insérer l'adresse dans la table `adresse`
    con.query("INSERT INTO Address SET ?", addressData, (err, addressResult) => {
      if (err) {
        console.log("Address", err);
        res.send('error');
      } else {
        const addressId = addressResult.insertId;
  
        const userData = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          gender: req.body.gender,
          birthday: req.body.birthday,
          email: req.body.email,
          password: req.body.password,
          token: req.body.token,
          phone: req.body.phone,
          email_sponsor: req.body.email_sponsor,
          id_role: req.body.id_role,
          id_address: addressId
        };
  
        // Insérer l'utilisateur dans la table `users` avec l'ID de l'adresse
        con.query("INSERT INTO Users SET ?", userData, (err, userResult) => {
          if (err) {
            console.log("Users", err);
            res.send('error');
          } else {
            res.send(userResult);
          }
        });
      }
    });
  };



User.update = (req, res) => { // modifier un utilisateur
    const data = [req.body.firstname, req.body.lastname, req.body.gender, req.body.birthday, req.body.email, req.body.password, req.body.token, req.body.phone, req.body.id_sponsor, req.body.id_role, req.body.id_address, req.params.id]
    con.query('UPDATE `cesi`.`Users` SET `firstname`=?, `lastname`=?, `gender`=?, `birthday`=?, `email`=?, `password`=?, `token`=?, `phone`=?, `email_sponsor`=?, `id_role`=?, `id_address`=? WHERE `id`=?', data, (err, result) => {
        if (err){
            res.send('error');
            console.log(err);
        }
        else{
            res.send(result);
            console.log(result);
        }
    }
    );
};

User.delete = (req, res) => { // supprimer un utilisateur avec date_in date_out.
    con.query('UPDATE `cesi`.`Users` SET `date_out`= NOW() WHERE `id`=?', req.params.id, (err, result) => {
        if (err){
            res.send('error');
            console.log(err);
            throw err; // arrête le programme
        }
        else{
            res.send(result);
            console.log(result);
        }
    }
    );
};

//Utilisateur et son rôle dans sa table
User.findRoleUser = (req, res) => { // Pour afficher un utilisateur
    con.query('SELECT * FROM `cesi`.`Users` INNER JOIN `cesi`.`Roles` ON Users.id_role = Roles.id WHERE Users.id = ? AND Users.date_out IS NULL', req.params.id, (err, result) => {
        if (err){
            res.send('error');
            console.log(err);
        }else{
            res.send(result);
        }
});
};

//Utilisateurs et tous les rôles dans sa table
User.findAllRolesUsers = (req, res) => { // Pour afficher des utilisateurs et leurs rôles
    con.query('SELECT * FROM `cesi`.`Users` INNER JOIN `cesi`.`Roles` ON Users.id_role = Roles.id WHERE Users.date_out IS NULL', (err, result) => {
        if (err){
            res.send('error');
            console.log(err);
        }else{
            res.send(result);
        }
});
};

User.findUserAddress = (req, res) => { // Pour afficher l'adresse d'un utilisateur
    con.query('SELECT * FROM `cesi`.`Users` INNER JOIN `cesi`.`Address` ON Address.id = Users.id_address WHERE Users.id = ? AND Users.date_out IS NULL', req.params.id, (err, result) => {
        if (err){
            res.send('error');
            console.log(err);
        }else{
            res.send(result);
        }
});
};

User.findAllUsersAddresses = (req, res) => { // Pour afficher les adresses des utilisateurs
    con.query('SELECT * FROM `cesi`.`Users` INNER JOIN `cesi`.`Address` ON Address.id = Users.id_address WHERE Users.date_out IS NULL', (err, result) => {
        if (err){
            res.send('error');
            console.log(err);
        }else{
            res.send(result);
        }
});
};

module.exports = User;
    