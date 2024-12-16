const express = require("express");
const { postRegister } = require("../mysql/registerFunctionQuery");

router = express.Router();

router.post("/register", async (req, res) => {
   const { email, password } = req.body;

   const register = await postRegister(email, password);
   res.json(register);
});

module.exports = router;
