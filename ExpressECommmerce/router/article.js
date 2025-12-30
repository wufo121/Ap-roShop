const express = require("express");
const multer = require("multer");
const articleController = require("../controller/articleController");

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

router.get("/articles", articleController.getArticles);
router.get("/articles/:id", articleController.getArticle);
router.post(
   "/articles",
   upload.single("image"),
   articleController.createArticle
);
router.delete("/articles/:id", articleController.deleteArticle);

module.exports = router;
