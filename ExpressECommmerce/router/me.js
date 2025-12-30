const express = require("express");
const authController = require("../controller/meController");

const router = express.Router();

router.get("/me", authController.getCurrentUser);

module.exports = router;
