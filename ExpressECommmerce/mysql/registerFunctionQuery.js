const pool = require("./pool");
const bcrypt = require("bcrypt");

function postRegister(username, email, address, password) {
   return new Promise((resolve, reject) => {
      if (!username || !email || !address || !password) {
         return reject({
            status: 400,
            message: "Tous les champs sont obligatoires",
         });
      }

      if (!email.includes("@") || !email.includes(".")) {
         return reject({ status: 400, message: "Email invalide" });
      }

      const checkEmailQuery = "SELECT * FROM Users WHERE email = ?";
      pool.query(checkEmailQuery, [email], (err, results) => {
         if (err) {
            console.error("Erreur lors de la vérification de l'email :", err);
            return reject({ status: 500, message: "Erreur serveur" });
         }
         if (results.length > 0) {
            return reject({ status: 400, message: "L'email est déjà utilisé" });
         }

         const checkUsernameQuery = "SELECT * FROM Users WHERE username = ?";
         pool.query(checkUsernameQuery, [username], (err, usernameResults) => {
            if (err) {
               console.error(
                  "Erreur lors de la vérification du nom d'utilisateur :",
                  err
               );
               return reject({ status: 500, message: "Erreur serveur" });
            }
            if (usernameResults.length > 0) {
               return reject({
                  status: 400,
                  message: "Ce nom d'utilisateur est déjà pris",
               });
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
               if (err) {
                  console.error(
                     "Erreur lors du hachage du mot de passe :",
                     err
                  );
                  return reject({ status: 500, message: "Erreur serveur" });
               }

               const insertQuery =
                  "INSERT INTO Users (username, email, address, password, role, createdAt) VALUES (?, ?, ?, ?, ?, NOW())";
               pool.query(
                  insertQuery,
                  [username, email, address, hashedPassword, "client"],
                  (err, results) => {
                     if (err) {
                        console.error("Erreur lors de l'inscription :", err);
                        return reject({
                           status: 500,
                           message: "Erreur serveur",
                        });
                     }
                     resolve({
                        status: 201,
                        message: "Inscription réussie",
                        userId: results.insertId,
                     });
                  }
               );
            });
         });
      });
   });
}

module.exports = {
   postRegister,
};
