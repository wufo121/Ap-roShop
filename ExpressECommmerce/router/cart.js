const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");
const authentificateToken = require("../middleware/middleware");

router.post("/cart", authentificateToken, cartController.addArticleToCart);
router.get("/cart", authentificateToken, cartController.getUserCart);
router.delete(
   "/cart/:productId",
   authentificateToken,
   cartController.removeArticleFromCart
);

module.exports = router;
