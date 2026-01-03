const loginQuery = require("../mysql/loginFunctionQuery");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function postLogin(email, password) {
   try {
      if (!email || !password) {
         console.log("Erreur : L'email et le mot de passe sont nécessaires");
         throw {
            status: 400,
            message: "L'email et le mot de passe sont nécessaires",
         };
      }

      const user = await loginQuery.findByEmail(email);

      if (!user) {
         console.log("Erreur : Aucun utilisateur trouvé avec cet email");
         throw { status: 401, message: "Identifiants invalides" };
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
         console.log("Erreur : Mot de passe incorrect");
         throw { status: 401, message: "Identifiants invalides" };
      }

      const token = jwt.sign(
         {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            address: user.address,
         },
         process.env.JWT_KEY,
         { algorithm: "HS256" }
      );

      return token;
   } catch (err) {
      if (err.status) {
         throw err;
      }
      console.error("Erreur lors de la connexion :", err);
      throw { status: 500, message: "Erreur serveur" };
   }
}

module.exports = {
   postLogin,
};
