const pool = require("./pool");

function getAllArticles() {
   return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Article", (err, rows) => {
         if (err) {
            console.error("Erreur lors de la récupération des articles :", err);
            reject(err);
         } else {
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

function getFilteredArticles(filters) {
   return new Promise((resolve, reject) => {
      let query = "SELECT * FROM Article WHERE 1=1";
      const params = [];

      if (filters.category && filters.category !== "") {
         query += " AND categoryId = ?";
         params.push(filters.category);
      }

      if (filters.maxPrice && !isNaN(filters.maxPrice)) {
         query += " AND price <= ?";
         params.push(parseFloat(filters.maxPrice));
      }

      if (filters.sort === "bestRated") {
         query = `
            SELECT a.*, IFNULL(AVG(r.rating), 0) as avgRating 
            FROM Article a 
            LEFT JOIN Reviews r ON a.id = r.productId 
            WHERE 1=1
         `;

         if (filters.category && filters.category !== "") {
            query += " AND a.categoryId = ?";
            params.push(filters.category);
         }

         if (filters.maxPrice && !isNaN(filters.maxPrice)) {
            query += " AND a.price <= ?";
            params.push(parseFloat(filters.maxPrice));
         }

         query += " GROUP BY a.id ORDER BY avgRating DESC";
      } else if (filters.sort === "noRated") {
         query = `
            SELECT a.* 
            FROM Article a 
            LEFT JOIN Reviews r ON a.id = r.productId 
            WHERE r.id IS NULL
         `;

         if (filters.category && filters.category !== "") {
            query += " AND a.categoryId = ?";
            params.push(filters.category);
         }

         if (filters.maxPrice && !isNaN(filters.maxPrice)) {
            query += " AND a.price <= ?";
            params.push(parseFloat(filters.maxPrice));
         }
      }

      pool.query(query, params, (err, rows) => {
         if (err) {
            console.error(
               "Erreur lors de la récupération des articles filtrés :",
               err
            );
            reject(err);
         } else {
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

function getArticleById(id) {
   return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Article WHERE id = ?", [id], (err, rows) => {
         if (err) {
            console.error(
               "Erreur lors de la récupération des données de l'article sélectionné",
               err
            );
            reject(err);
         } else {
            resolve(rows[0]);
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

function deleteArticleById(articleId) {
   return new Promise((resolve, reject) => {
      pool.query(
         "SELECT imageUrl FROM Article WHERE id = ?",
         [articleId],
         (err, result) => {
            if (err) {
               reject(err);
               return;
            }

            const imageUrl = result[0]?.imageUrl;

            pool.query(
               "DELETE FROM Article WHERE id = ?",
               [articleId],
               (err, deleteResult) => {
                  if (err) {
                     reject(err);
                  } else {
                     resolve({ deleteResult, imageUrl });
                  }
               }
            );
         }
      );
   });
}

module.exports = {
   getAllArticles,
   saveArticle,
   deleteArticleById,
   getArticleById,
   getFilteredArticles,
};
