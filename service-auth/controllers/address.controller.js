const database = require("../connexion_mysql"); // importation de la connexion à la base de données
const con = database.getConnection();
const express = require('express');
const app = express();
const Address = require('../models/address.model.js');

Address.findAll = (req, res) => { // Pour afficher tous les utilisateurs
    con.query('SELECT * FROM `cesi`.`Address` WHERE date_out IS NULL ', (err, result) => {
        if (err){
            res.send('error', err);
            // console.log(err);
        }else{
            const totalCount = result.length; // Nombre total de résultats
            res.setHeader('X-Total-Count', totalCount); // Définition de l'en-tête "X-Total-Count"
            res.send(result);
    }
});
};

Address.findOne = (req, res) => { // Pour afficher un utilisateur
    con.query('SELECT * FROM `cesi`.`Address` WHERE id = ? AND date_out IS NULL', req.params.id, (err, result) => {
        if (err){
            res.send('error', err);
            // console.log(err);
        }else{
            res.send(result);
        }
});
};

Address.create = (req, res) => { // créer un utilisateur
    con.query('INSERT INTO `cesi`.`Address` SET ?', req.body, (err, result) => {
        if (err){
            res.send('error', err);
        }
        else{
            res.send(result);
        }
    }
    );
};

Address.update = (req, res) => { // modifier un utilisateur
    const data = [req.body.postal_code, req.body.street, req.body.city, req.body.street_number, req.body.lati, req.body.longi, req.params.id]
    con.query('UPDATE `cesi`.`Address` SET `postal_code`=?, `street`=?, `city`=?, `street_number`=?, `lati`=?, `longi`=? WHERE `id`=?', data, (err, result) => {
        if (err){
            res.send('error', err);
            // console.log(err);
        }
        else{
            res.send(result);
            // console.log(result);
        }
    }
    );
};

Address.delete = (req, res) => { // supprimer un utilisateur avec date_in date_out.
    con.query('UPDATE `cesi`.`Address` SET `date_out`= NOW() WHERE `id`=?', req.params.id, (err, result) => {
        if (err){
            res.send('error', err);
            // console.log(err);
            throw err; // arrête le programme
        }
        else{
            res.send(result);
            // console.log(result);
        }
    }
    );
};

module.exports = Address;
    