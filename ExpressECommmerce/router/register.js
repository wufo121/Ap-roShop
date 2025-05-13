const express = require("express");
const { postRegister } = require("../mysql/registerFunctionQuery");

router = express.Router();

router.post("/register", async (req, res) => {
   try {
      const { username, email, address, password } = req.body;
      const registerResult = await postRegister(
         username,
         email,
         address,
         password
      );
      res.status(registerResult.status).json(registerResult);
   } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      res.status(error.status || 500).json({
         message: error.message || "Erreur serveur",
      });
   }
});

module.exports = router;
