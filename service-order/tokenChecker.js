const jwt = require("jsonwebtoken");
const config = require("./config");
const { all } = require("axios");

module.exports = (allowedRoles, checkid) => {
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
            // if (req.params.id ) { 
            //   if (decoded.id === parseInt(req.params.id)) {
            //     next();
            //   }
            //   else{
            //     return res
            //     .status(403)
            //     .json({ error: true, message: "Unauthorized access." });
            //   }
            // } 
            // else
              next();
            }
            // Si paramètre id dans l'url alors on vérifie que l'utilisateur est bien le propriétaire de la ressource
            // if (req.params.id) {
            //   if (decoded.id === parseInt(req.params.id)) { 
            //     console.log("decoded.id = " + decoded.id);
            //     res.send("ok");
            //     nextok = true;
            //     next();
            //   }
            // } else {
            //   return res
            //     .status(403)
            //     .json({ error: true, message: "Unauthorized access." });
            // }
            
          });
        if (!nextok) {
          return res
            .status(403)
            .json({ error: true, message: "Unauthorized access." });
        }

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
