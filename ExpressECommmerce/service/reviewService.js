const reviewQuery = require("../mysql/reviewFunctionQuery");

async function getReviews(articleId) {
   try {
      const reviews = await reviewQuery.findByProductId(articleId);
      return reviews;
   } catch (error) {
      console.error("Erreur lors de la récupération des avis :", error);
      throw error;
   }
}

async function addReviews(productId, userId, rating, comment) {
   try {
      const result = await reviewQuery.create(
         productId,
         userId,
         rating,
         comment
      );
      return result;
   } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis :", error);
      throw error;
   }
}

async function getNoteReviews(articleId) {
   try {
      const ratings = await reviewQuery.findRatingsByProductId(articleId);
      return ratings;
   } catch (error) {
      console.error("Erreur lors de la récupération des notes :", error);
      throw error;
   }
}

module.exports = {
   getReviews,
   addReviews,
   getNoteReviews,
};
