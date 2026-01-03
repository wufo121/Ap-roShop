const registerQuery = require("../mysql/registerFunctionQuery");
const bcrypt = require("bcrypt");

async function postRegister(username, email, address, password) {
   try {
      if (!username || !email || !address || !password) {
         throw {
            status: 400,
            message: "Tous les champs sont obligatoires",
         };
      }

      if (!email.includes("@") || !email.includes(".")) {
         throw { status: 400, message: "Email invalide" };
      }

      const existingEmail = await registerQuery.findByEmail(email);
      if (existingEmail) {
         throw { status: 400, message: "L'email est déjà utilisé" };
      }

      const existingUsername = await registerQuery.findByUsername(username);
      if (existingUsername) {
         throw {
            status: 400,
            message: "Ce nom d'utilisateur est déjà pris",
         };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await registerQuery.createUser(
         username,
         email,
         address,
         hashedPassword
      );

      return {
         status: 201,
         message: "Inscription réussie",
         userId: userId,
      };
   } catch (err) {
      if (err.status) {
         throw err;
      }
      console.error("Erreur lors de l'inscription :", err);
      throw { status: 500, message: "Erreur serveur" };
   }
}

module.exports = {
   postRegister,
};
