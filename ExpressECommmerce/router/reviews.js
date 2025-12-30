const express = require("express");
const router = express.Router();
const reviewsController = require("../controller/reviewController");
const authentificateToken = require("../middleware/middleware");

router.get("/articles/:articleId/reviews", reviewsController.getArticleReviews);
router.get("/articles/:articleId/rating", reviewsController.getArticleRating);
router.post(
   "/articles/:articleId/reviews",
   authentificateToken,
   reviewsController.addArticleReview
);

module.exports = router;
