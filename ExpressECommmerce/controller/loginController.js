const { postLogin } = require("../service/loginService");

exports.login = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: "Email et mot de passe requis",
         });
      }

      const login = await postLogin(email, password);
      res.json(login);
   } catch (error) {
      console.error("Erreur lors de la connexion", error);
      res.status(500).json({
         success: false,
         message: "Erreur lors de la connexion",
      });
   }
};
