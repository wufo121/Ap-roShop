const express = require("express");
const { getAllArticles } = require("../mysql/articleFunctionQuery");

router = express.Router();

router.get("/articles", async (req, res) => {
   const articles = await getAllArticles();
   res.json(articles);
});

module.exports = router;
