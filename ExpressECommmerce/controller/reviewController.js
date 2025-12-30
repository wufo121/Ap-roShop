const {
   getReviews,
   addReviews,
   getNoteReviews,
} = require("../mysql/reviewsFunction");

exports.getArticleReviews = async (req, res) => {
   try {
      const reviews = await getReviews(req.params.articleId);
      res.json({ success: true, data: reviews });
   } catch (error) {
      console.error("Erreur lors de la récupération des avis", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
   }
};

exports.getArticleRating = async (req, res) => {
   try {
      const rating = await getNoteReviews(req.params.articleId);
      res.json({ success: true, data: rating });
   } catch (error) {
      console.error("Erreur lors de la récupération des notes", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
   }
};

exports.addArticleReview = async (req, res) => {
   try {
      const { rating, comment } = req.body;
      const productId = req.params.articleId;
      const userId = req.user.id;

      if (!rating || !comment) {
         return res.status(400).json({
            success: false,
            message: "La note et le commentaire sont requis",
         });
      }

      await addReviews(productId, userId, rating, comment);
      const updateReviews = await getReviews(productId);

      res.json({
         success: true,
         message: "Avis ajouté avec succès",
         data: updateReviews,
      });
   } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis", error);
      res.status(500).json({
         success: false,
         message: "Erreur lors de l'ajout de l'avis",
      });
   }
};
