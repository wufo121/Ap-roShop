const { postRegister } = require("../mysql/registerFunctionQuery");

exports.register = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: "Email et mot de passe requis",
         });
      }

      const register = await postRegister(email, password);
      res.json(register);
   } catch (error) {
      console.error("Erreur lors de l'inscription", error);
      res.status(500).json({
         success: false,
         message: "Erreur lors de l'inscription",
      });
   }
};
