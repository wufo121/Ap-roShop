const express = require("express");
const { getAllCategories } = require("../mysql/categoriesFunction");

const router = express.Router();

router.get("/categories", async (req, res) => {
   try {
      const categories = await getAllCategories();
      res.json(categories);
   } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
      res.status(500).json({ message: "Erreur serveur" });
   }
});

module.exports = router;
