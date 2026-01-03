const {
   addToCart,
   getCartArticleByUser,
   removeFromCart,
} = require("../service/cartService");

exports.addArticleToCart = async (req, res) => {
   console.log("Données reçues dans le panier:", req.body);
   const { productId, quantity } = req.body;
   const userId = req.user.id;

   if (!productId || !quantity) {
      return res.status(400).json({
         success: false,
         message: "Le produit ou la quantité sont manquants",
      });
   }

   try {
      const result = await addToCart(userId, productId, quantity);

      res.json({
         success: true,
         message: "Le produit a bien été ajouté au panier",
         data: result,
      });
   } catch (error) {
      console.error("Erreur lors de l'ajout au panier", error);
      res.status(500).json({
         success: false,
         message: "Erreur lors de l'ajout au panier",
      });
   }
};

exports.getUserCart = async (req, res) => {
   const userId = req.user.id;

   try {
      const results = await getCartArticleByUser(userId);
      res.json({
         success: true,
         data: results,
      });
   } catch (error) {
      console.error("Erreur lors de la récupération du panier", error);
      res.status(500).json({
         success: false,
         message: "Erreur lors de la récupération du panier",
      });
   }
};

exports.removeArticleFromCart = async (req, res) => {
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
};
