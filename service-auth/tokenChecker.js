const jwt = require("jsonwebtoken");
const config = require("./config");
const { all } = require("axios");

module.exports = (allowedRoles) => {
  return (req, res, next) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    // Decode token
    if (token) {
      // Verify secret and check expiration
      jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
          return res
            .status(401)
            .json({ error: true, message: "Unauthorized access." });
        }

        req.decoded = decoded;

        console.log(allowedRoles);
        var nextok = false;
        if (!allowedRoles.length) {
          nextok = true;
          next();
        }
        //foreach allowedroles and next() if decoded[i] === 1
        allowedRoles.forEach((role) => {
          if (decoded[role] === 1) {
            nextok = true;
            next();
          }
        });
        if (!nextok) {
          return res
            .status(403)
          .json({ error: true, message: "Unauthorized access."});
        
        }
      


        // if (userCustomer === 1) {
        //   // L'utilisateur a le rôle d'administrateur, continuez le traitement
        //   next();
        // } else {
        //   // L'utilisateur n'a pas les autorisations nécessaires
        //   return res
        //     .status(403)
        //     .json({ error: true, message: "Unauthorized access." });
        // }
      });
    } else {
      // If there is no token
      // Return an error
      return res.status(403).send({
        error: true,
        message: "No token provided.",
      });
    }
  };
};
