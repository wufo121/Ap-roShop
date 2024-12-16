const pool = require("./pool");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function postLogin(email, password) {
   return new Promise((resolve, reject) => {
      if (!email || !password) {
         console.log("Erreur : L'email et le mot de passe sont nécessaires");
         return reject({
            status: 400,
            message: "L'email et le mot de passe sont nécessaires",
         });
      }

      const query = "SELECT * FROM Users WHERE email = ?";
      pool.query(query, [email], (err, results) => {
         if (err) {
            console.error(
               "Erreur lors de la vérification des utilisateurs :",
               err
            );
            return reject({ status: 500, message: "Erreur serveur" });
         }

         if (results.length === 0) {
            console.log("Erreur : Aucun utilisateur trouvé avec cet email");
            return reject({ status: 401, message: "Identifiants invalides" });
         }

         const user = results[0];

         bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
               console.error(
                  "Erreur lors de la comparaison du mot de passe :",
                  err
               );
               return reject({ status: 500, message: "Erreur serveur" });
            }

            if (!isMatch) {
               console.log("Erreur : Mot de passe incorrect");
               return reject({
                  status: 401,
                  message: "Identifiants invalides",
               });
            }

            const token = jwt.sign(
               {
                  id: user.id,
                  username: user.username,
                  role: user.role,
               },
               process.env.JWT_KEY,
               { algorithm: "HS256" }
            );
            resolve(token);
         });
      });
   });
}

module.exports = {
   postLogin,
};
