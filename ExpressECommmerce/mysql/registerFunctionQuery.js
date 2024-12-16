const pool = require("./pool");
const bcrypt = require("bcrypt");

function postRegister(email, password) {
   return new Promise((resolve, reject) => {
      if (!email || !password) {
         return reject({
            status: 400,
            message: "L'email et le mot de passe sont nécessaires",
         });
      }
      const checkEmailQuery = "SELECT * FROM Users WHERE email = ?";
      pool.query(checkEmailQuery, [email], (err, results) => {
         if (err) {
            console.error("Erreur lors de la verification de l'email :", err);
            return reject({ status: 500, message: "Erreur serveur" });
         }
         if (results.length > 0) {
            return reject({ status: 400, message: "L'email est déjà utilisé" });
         }
         bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
               console.error("Erreur lors du hachage du mot de passe :", err);
               return reject({ status: 500, message: "Erreur serveur" });
            }
            const username = email.split("@")[0];
            const insertQuery =
               "INSERT INTO Users (email, password, username, role) VALUES (?, ?, ?, ?)";
            pool.query(
               insertQuery,
               [email, hashedPassword, username, "client"],
               (err, results) => {
                  if (err) {
                     console.error("Erreur lors de l'inscription :", err);
                     return reject({ status: 500, message: "Erreur serveur" });
                  }
                  resolve({ status: 201, message: "Inscription réussie" });
               }
            );
         });
      });
   });
}
module.exports = {
   postRegister,
};
