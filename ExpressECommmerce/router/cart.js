const express = require("express");
const router = express.Router();
const {
   addToCart,
   getCartArticleByUser,
   removeFromCart,
} = require("../mysql/cartFunction");
const authentificateToken = require("../middleware/middleware");

router.post("/cart", authentificateToken, async (req, res) => {
   console.log("Données reçues dans le panier:", req.body);
   const { productId, quantity } = req.body;
   const userId = req.user.id;

   if (!productId || !quantity) {
      return res.status(400).json({
         success: false,
         message: "Le produit ou la quantité sont manquante",
      });
   }
   try {
      const result = await addToCart(userId, productId, quantity);

      res.json({
         success: true,
         message: "Le prduit à bien été ajouté au panier",
         data: result,
      });
   } catch (error) {
      console.error("Erreur lors de l'ajout au panier", error);
      res.status(500).json({
         success: false,
         message: "Erreur lors de l'ajout au panier",
      });
   }
});

router.get("/cart", authentificateToken, async (req, res) => {
   const userId = req.user.id;

   try {
      const results = await getCartArticleByUser(userId);
      res.json({
         data: results,
      });
   } catch (error) {
      console.error("Erreur lors de la récupération du panier", error);
      res.status(500).json({
         success: false,
         message: "Erreur lors de la récupération du panier",
      });
   }
});

router.delete("/cart/:productId", authentificateToken, async (req, res) => {
   const userId = req.user.id;
   const { productId } = req.params;

   if (!productId) {
      return res.status(400).json({
         success: false,
         message: "L'identifiant du produit est manquant",
      });
   }

   try {
      const result = await removeFromCart(userId, productId);
      res.json({
         success: true,
         message: "Article supprimé du panier avec succès",
         data: result,
      });
   } catch (error) {
      console.error(
         "Erreur lors de la suppression de l'article du panier",
         error
      );
      res.status(500).json({
         success: false,
         message: "Erreur lors de la suppression de l'article du panier",
      });
   }
});

module.exports = router;
