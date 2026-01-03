const cartQuery = require("../mysql/cartFunctionQuery");

async function getOrCreateCart(userId) {
   try {
      const cart = await cartQuery.findCartByUserId(userId);

      if (!cart) {
         const cartId = await cartQuery.createCart(userId);
         return cartId;
      }

      return cart.id;
   } catch (error) {
      console.error(
         "Erreur lors de la récupération ou création du panier :",
         error
      );
      throw error;
   }
}

async function addToCart(userId, productId, quantity) {
   try {
      const cartId = await getOrCreateCart(userId);
      const result = await cartQuery.addOrUpdateCartItem(
         cartId,
         productId,
         quantity
      );
      return result;
   } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
      throw error;
   }
}

async function getCartArticleByUser(userId) {
   try {
      const items = await cartQuery.findCartItemsByUserId(userId);
      return items;
   } catch (error) {
      console.error(
         "Erreur lors de la récupération des articles du panier :",
         error
      );
      throw error;
   }
}

async function removeFromCart(userId, productId) {
   try {
      await cartQuery.deleteCartItem(userId, productId);
      return { message: "Article supprimé du panier avec succès." };
   } catch (error) {
      console.error(
         "Erreur lors de la suppression de l'article du panier :",
         error
      );
      throw error;
   }
}

module.exports = {
   addToCart,
   getCartArticleByUser,
   removeFromCart,
};
