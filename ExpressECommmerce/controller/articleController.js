const path = require("path");
const fs = require("fs");
const {
   saveArticle,
   deleteArticleById,
   getArticleById,
   getFilteredArticles,
} = require("../service/articleService");

exports.getArticles = async (req, res) => {
   try {
      const { category, sort, maxPrice } = req.query;
      const filters = { category, sort, maxPrice };
      const articles = await getFilteredArticles(filters);
      res.json(articles);
   } catch (error) {
      console.error("Erreur lors de la récupération des articles :", error);
      res.status(500).json({ message: "Erreur serveur" });
   }
};
exports.getArticle = async (req, res) => {
   try {
      const articleId = req.params.id;
      const article = await getArticleById(articleId);

      if (!article) {
         return res.status(404).json({ message: "Article non trouvé" });
      }

      res.json(article);
   } catch (error) {
      console.error("Erreur lors de la récupération de l'article :", error);
      res.status(500).json({ message: "Erreur serveur" });
   }
};

exports.createArticle = async (req, res) => {
   try {
      const { name, description, price, category, stock } = req.body;

      if (!req.file) {
         return res.status(400).json({
            message: "Veuillez fournir une image valide (JPG, PNG ou WEBP)",
         });
      }

      const imagePath = `/imagesArticle/${req.file.filename}`;

      const articleData = {
         name,
         description,
         price: parseFloat(price),
         category: parseInt(category),
         stock: parseInt(stock),
         imagePath,
      };

      await saveArticle(articleData);

      res.status(201).json({
         message: "Article ajouté avec succès",
         article: articleData,
      });
   } catch (error) {
      console.error("Erreur lors de l'ajout de l'article :", error);
      res.status(500).json({ message: "Erreur serveur" });
   }
};

exports.deleteArticle = async (req, res) => {
   try {
      const articleId = parseInt(req.params.id);

      if (isNaN(articleId)) {
         return res.status(400).json({ message: "ID invalide" });
      }

      const { deleteResult, imageUrl } = await deleteArticleById(articleId);

      if (deleteResult.affectedRows === 0) {
         return res.status(404).json({ message: "Article non trouvé" });
      }

      if (imageUrl) {
         const imagePath = path.join(__dirname, "../public", imageUrl);
         fs.unlink(imagePath, (err) => {
            if (err) {
               console.error("Erreur lors de la suppression de l'image:", err);
            }
         });
      }

      res.status(200).json({ message: "Article supprimé avec succès" });
   } catch (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
      res.status(500).json({ message: "Erreur serveur" });
   }
};
