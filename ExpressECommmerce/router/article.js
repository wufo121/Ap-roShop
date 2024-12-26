const express = require("express");
const multer = require("multer");
const path = require("path");
const {
   getAllArticles,
   saveArticle,
} = require("../mysql/articleFunctionQuery");

const router = express.Router();

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "public/imagesArticle");
   },
   filename: (req, file, cb) => {
      const timestamp = Date.now();
      const sanitizedFileName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${timestamp}-${sanitizedFileName}`);
   },
});

const fileFilter = (req, file, cb) => {
   const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
   if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
   } else {
      cb(
         new Error("Seuls les fichiers JPG, PNG et WEBP sont autorisés"),
         false
      );
   }
};

const upload = multer({ storage, fileFilter });

router.get("/articles", async (req, res) => {
   try {
      const articles = await getAllArticles();
      res.json(articles);
   } catch (error) {
      console.error("Erreur lors de la récupération des articles :", error);
      res.status(500).json({ message: "Erreur serveur" });
   }
});

router.post("/articles", upload.single("image"), async (req, res) => {
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
});

module.exports = router;
