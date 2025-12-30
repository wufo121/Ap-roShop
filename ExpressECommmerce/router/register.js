const express = require("express");
const registerController = require("../controller/registerController");

const router = express.Router();

<<<<<<< HEAD
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
=======
router.post("/register", registerController.register);
>>>>>>> afcc062 (controller)

module.exports = router;
