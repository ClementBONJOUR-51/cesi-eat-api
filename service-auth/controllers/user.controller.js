const database = require("../connexion_mysql"); // importation de la connexion à la base de données
const con = database.getConnection();
const express = require('express');
const app = express();
const User = require('../models/user.model.js');

User.findAll = (req, res) => { // Pour afficher tous les utilisateurs
    con.query('SELECT * FROM `cesi`.`Users` WHERE date_out IS NULL ', (err, result) => {
        if (err){
            res.send('error');
            console.log(err);
        }else{
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

User.create = (req, res) => { // créer un utilisateur
    con.query('INSERT INTO `cesi`.`Users` SET ?', req.body, (err, result) => {
        if (err){
            res.send('error');
        }
        else{
            res.send(result);
        }
    }
    );
};

User.update = (req, res) => { // modifier un utilisateur
    const data = [req.body.name, req.body.like, req.params.id]
    con.query('UPDATE `cesi`.`Users` SET `firstname`=?, `lastname`=?, `gender`=?, `birthday`=?, `email`=?, `password`=?, `token`=?, `phone`=?, `id_sponsor`=?, `id_role`=?, `id_address`=? WHERE `id`=?', data, (err, result) => {
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

module.exports = User;
    