const pool = require("./pool");

function getAllArticles() {
   return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Article", (err, rows) => {
         if (err) {
            console.error("Erreur lors de la récupération des articles :", err);
            reject(err);
         } else {
            // Correction des chemins relatifs d'images
            rows.forEach((row) => {
               if (row.imageUrl && !row.imageUrl.startsWith("/")) {
                  row.imageUrl = `/${row.imageUrl}`;
               }
            });
            resolve(rows);
         }
      });
   });
}

function saveArticle(articleData) {
   return new Promise((resolve, reject) => {
      const query = `
         INSERT INTO Article (name, description, price, categoryId, stock, imageUrl, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const values = [
         articleData.name,
         articleData.description,
         articleData.price,
         articleData.category,
         articleData.stock,
         articleData.imagePath,
      ];

      pool.query(query, values, (err, result) => {
         if (err) {
            console.error(
               "Erreur lors de l'enregistrement de l'article :",
               err
            );
            reject(err);
         } else {
            resolve(result);
         }
      });
   });
}

module.exports = {
   getAllArticles,
   saveArticle,
};
