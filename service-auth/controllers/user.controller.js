const database = require("../connexion_mysql"); // importation de la connexion à la base de données
const con = database.getConnection();
const express = require("express");
const app = express();
const User = require("../models/user.model.js");
app.use(express.json());
const jwt = require("jsonwebtoken");
const config = require("../config");

User.findAll = (req, res) => {
  con.query(
    "SELECT * FROM cesi.Users WHERE date_out IS NULL",
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
            message: "Les utilisateurs sont introuvables !",
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

User.findOne = (req, res) => {
  // Pour afficher un utilisateur
  con.query(
    "SELECT * FROM `cesi`.`Users` WHERE id = ? AND date_out IS NULL",
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
            message: "L'utilisateur est introuvable !",
          });
        } else {
          res.send({ status: "success", result: result[0] });
        }
      }
    }
  );
};

// Créer adresse et l'utilisateur en retournant l'id de la table adresse nouvellement créée dans la table utilisateur
User.create = (req, res) => {
  const addressData = {
    postal_code: req.body.postal_code,
    street: req.body.street,
    city: req.body.city,
    street_number: req.body.street_number,
    lati: req.body.lati,
    longi: req.body.longi,
  };

  // Insérer l'adresse dans la table `adresse`
  con.query("INSERT INTO Address SET ?", addressData, (err, addressResult) => {
    if (err) {
      // console.log("Address", err);
      res.send({
        status: "error",
        message: "Les données sont incorrectes dans l'adresse !",
        error: err,
      });
    } else {
      const addressId = addressResult.insertId;

      // créer role
      const roleData = {
        customer: req.body.customer || 0,
        delivery_person: req.body.delivery_person || 0,
        restorant: req.body.restorant || 0,
        administrator: req.body.administrator || 0,
        sales_department: req.body.sales_department || 0,
        technical_department: req.body.technical_department || 0,
        developer_tier: req.body.developer_tier || 0,
      };

      // Changer les null en 0
      roleDataUpdate = [roleData].map((elementRole) => {
        for (const key in elementRole) {
          if (elementRole[key] === null) {
            elementRole[key] = 0;
          }
        }
        return elementRole;
      });

      // Insérer le role dans la table users avec ID Role
      // Table role
      con.query(
        "INSERT INTO Roles SET ?",
        roleDataUpdate,
        (err, roleResult) => {
          if (err) {
            console.log(roleDataUpdate);
            res.send({
              status: "error",
              message: "Les données sont incorrectes dans roles !",
              error: err,
            });
          } else {
            // Remplacer les valeurs null par 0 dans le résultat avant de l'utiliser

            const roleId = roleResult.insertId;

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
              id_role: roleId,
              id_address: addressId,
            };

            // Insérer l'utilisateur dans la table `users` avec l'ID de l'adresse
            con.query(
              "INSERT INTO Users SET ?",
              userData,
              (err, userResult) => {
                if (err) {
                  res.send({
                    status: "error",
                    message: "Les données sont incorrectes dans users !",
                    error: err,
                  });
                  // console.log(err);
                } else {
                  if (userResult.length == 0) {
                    res.send({
                      status: "error",
                      message: "L'utilisateur n'a pas pu être ajouté !",
                    });
                  } else {
                    res.send({ status: "success", result: userResult });
                  }
                } // else
              }
            );
          }
        }
      );
    }
  });
};

// User.update = (req, res) => {
//   // modifier un utilisateur
//   const data = [
//     req.body.firstname,
//     req.body.lastname,
//     req.body.gender,
//     req.body.birthday,
//     req.body.email,
//     req.body.password,
//     req.body.token,
//     req.body.phone,
//     req.body.email_sponsor,
//     req.body.id_role,
//     req.body.id_address,
//     req.params.id,
//   ];
//   con.query(
//     "UPDATE `cesi`.`Users` SET `firstname`=?, `lastname`=?, `gender`=?, `birthday`=?, `email`=?, `password`=?, `token`=?, `phone`=?, `email_sponsor`=?, `id_role`=?, `id_address`=? WHERE `id`=?",
//     data,
//     (err, result) => {
//       if (err) {
//         res.send({
//           status: "error",
//           message: "Les données sont incorrectes !",
//           error: err,
//         });
//         // console.log(err);
//       } else {
//         if (result.length == 0) {
//           res.send({
//             status: "error",
//             message: "Le compte utilisateur est introuvable !",
//           });
//         } else {
//           res.send({ status: "success", "result": result });
//         }
//       }
//     }
//   );
// };

User.update = (req, res) => {
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
  };

  const addressData = {
    postal_code: req.body.postal_code,
    street: req.body.street,
    city: req.body.city,
    street_number: req.body.street_number,
    lati: req.body.lati,
    longi: req.body.longi,
  };

  const roleData = {
    customer: req.body.customer || 0,
    delivery_person: req.body.delivery_person || 0,
    restorant: req.body.restorant || 0,
    administrator: req.body.administrator || 0,
    sales_department: req.body.sales_department || 0,
    technical_department: req.body.technical_department || 0,
    developer_tier: req.body.developer_tier || 0,
  };

  con.beginTransaction((err) => {
    if (err) {
      res.send({
        status: "error",
        message: "Erreur lors du démarrage de la transaction !",
        error: err,
      });
    } else {
      con.query(
        "UPDATE `cesi`.`Users` SET ? WHERE `id`=?",
        [userData, req.params.id],
        (err, userResult) => {
          if (err) {
            con.rollback(() => {
              res.send({
                status: "error",
                message: "Erreur lors de la mise à jour de l'utilisateur !",
                error: err,
              });
            });
          } else {
            con.query(
              "UPDATE `cesi`.`Address` SET ? WHERE `id`=(SELECT id_address FROM `cesi`.`Users` WHERE `id`=?)",
              [addressData, req.params.id],
              (err, addressResult) => {
                if (err) {
                  con.rollback(() => {
                    res.send({
                      status: "error",
                      message: "Erreur lors de la mise à jour de l'adresse !",
                      error: err,
                    });
                  });
                } else {
                  con.query(
                    "UPDATE `cesi`.`Roles` SET ? WHERE `id`=(SELECT id_role FROM `cesi`.`Users` WHERE `id`=?)",
                    [roleData, req.params.id],
                    (err, roleResult) => {
                      if (err) {
                        con.rollback(() => {
                          res.send({
                            status: "error",
                            message: "Erreur lors de la mise à jour du rôle !",
                            error: err,
                          });
                        });
                      } else {
                        con.commit((err) => {
                          if (err) {
                            con.rollback(() => {
                              res.send({
                                status: "error",
                                message:
                                  "Erreur lors de la validation de la transaction !",
                                error: err,
                              });
                            });
                          } else {
                            res.send({
                              status: "success",
                              message:
                                "Les informations de l'utilisateur ont été mises à jour avec succès !",
                            });
                          }
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  });
};

User.delete = (req, res) => {
  // supprimer un utilisateur avec date_in date_out et prendre en compte aussi le role et l'address
  con.query(
    "UPDATE `cesi`.`Users` SET `date_out`= NOW() WHERE `id`=?",
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
            message: "Le compte utilisateur est introuvable !",
          });
        } else {
          res.send({ status: "success", result: result });
        }
      }
    }
  );
};

//Utilisateur et son rôle dans sa table
User.findRoleUser = (req, res) => {
  // Pour afficher un utilisateur
  con.query(
    "SELECT * FROM `cesi`.`Users` INNER JOIN `cesi`.`Roles` ON Users.id_role = Roles.id WHERE Users.id = ? AND Users.date_out IS NULL",
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
            message: "L'utilisateur n'a pas été trouvé ! ",
          });
        } else {
          res.send({ status: "success", result: result });
        }
      }
    }
  );
};

//Utilisateurs et tous les rôles dans sa table
User.findAllRolesUsers = (req, res) => {
  // Pour afficher des utilisateurs et leurs rôles
  con.query(
    "SELECT * FROM `cesi`.`Users` INNER JOIN `cesi`.`Roles` ON Users.id_role = Roles.id WHERE Users.date_out IS NULL",
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
            message: "L'utilisateur n'a pas été trouvé ! ",
          });
        } else {
          res.send({ status: "success", result: result });
        }
      }
    }
  );
};

User.findUserAddress = (req, res) => {
  // Pour afficher l'adresse d'un utilisateur
  con.query(
    "SELECT * FROM `cesi`.`Users` INNER JOIN `cesi`.`Address` ON Address.id = Users.id_address WHERE Users.id = ? AND Users.date_out IS NULL",
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
            message: "L'utilisateur n'a pas été trouvé ! ",
          });
        } else {
          res.send({ status: "success", result: result });
        }
      }
    }
  );
};

User.findAllUsersAddresses = (req, res) => {
  // Pour afficher les adresses des utilisateurs
  con.query(
    "SELECT * FROM `cesi`.`Users` INNER JOIN `cesi`.`Address` ON Address.id = Users.id_address WHERE Users.date_out IS NULL",
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
            message: "L'utilisateur n'a pas été trouvé ! ",
          });
        } else {
          res.send({ status: "success", result: result });
        }
      }
    }
  );
};

module.exports = User;
