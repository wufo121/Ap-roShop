const jwt = require("jsonwebtoken");
require("dotenv").config();

function authentificateToken(req, res, next) {
   const authHeader = req.header("Authorization");

   if (!authHeader) {
      console.log("Aucun header d'autorisation");
      return res
         .status(401)
         .json({ message: "Access denied. No token provided." });
   }

   const token = authHeader.split(" ")[1];

   if (!token) {
      console.log("Token manquant");
      return res
         .status(401)
         .json({ message: "Access denied. No token provided." });
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.user = decoded;

      next();
   } catch (ex) {
      console.log("Token invalide");
      res.status(400).json({ message: "Invalid token." });
   }
}

module.exports = authentificateToken;
