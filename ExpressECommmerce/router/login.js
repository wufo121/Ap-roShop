const express = require("express");
const { postLogin } = require("../mysql/loginFunctionQuery");

router = express.Router();

router.post("/login", async (req, res) => {
   const { email, password } = req.body;

   const login = await postLogin(email, password);
   res.json(login);
});

module.exports = router;
