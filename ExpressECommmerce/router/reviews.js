const express = require("express");
const router = express.Router();
const {
   getReviews,
   addReviews,
   getNoteReviews,
} = require("../mysql/reviewsFunction");
const authentificateToken = require("../middleware/middleware");

router.get("/articles/:articleId/reviews", async (req, res) => {
   try {
      const reviews = await getReviews(req.params.articleId);
      res.json({ sucess: true, data: reviews });
   } catch (error) {
      console.error("Erreur lors de la récupérations des avis", error);
      res.status(500).json({ sucess: false, message: "Erreur" });
   }
});

router.get("/articles/:articleId/rating", async (req, res) => {
   try {
      const rating = await getNoteReviews(req.params.articleId);
      res.json({ success: true, data: rating });
   } catch (error) {
      console.error("Erreur lors de la récupérations des notes", error);
      res.status(500).json({ sucess: false, message: "Erreur" });
   }
});

router.post(
   "/articles/:articleId/reviews",
   authentificateToken,
   async (req, res) => {
      try {
         const { rating, comment } = req.body;
         const productId = req.params.articleId;
         const userId = req.user.id;

         if (!rating || !comment) {
            return res.status(400).json({
               sucess: false,
               message: "La note et le commentaire sont requis",
            });
         }
         await addReviews(productId, userId, rating, comment);
         const updateReviews = await getReviews(productId);

         res.json({
            sucess: true,
            message: "avis ajouté",
            data: updateReviews,
         });
      } catch (error) {
         console.error("Erreur lors de l'ajout de l'avis", error);
         res.status(500).json({
            success: false,
            message: "Erreur lors de l'ajout de l'avis",
         });
      }
   }
);

module.exports = router;
