const pool = require("./pool");

function findAll() {
   return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Article", (err, rows) => {
         if (err) {
            reject(err);
         } else {
            resolve(rows);
         }
      });
   });
}

function findByFilters(filters) {
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

      pool.query(query, params, (err, rows) => {
         if (err) {
            reject(err);
         } else {
            resolve(rows);
         }
      });
   });
}

function findAllWithAvgRating(filters) {
   return new Promise((resolve, reject) => {
      let query = `
         SELECT a.*, IFNULL(AVG(r.rating), 0) as avgRating 
         FROM Article a 
         LEFT JOIN Reviews r ON a.id = r.productId 
         WHERE 1=1
      `;
      const params = [];

      if (filters.category && filters.category !== "") {
         query += " AND a.categoryId = ?";
         params.push(filters.category);
      }

      if (filters.maxPrice && !isNaN(filters.maxPrice)) {
         query += " AND a.price <= ?";
         params.push(parseFloat(filters.maxPrice));
      }

      query += " GROUP BY a.id ORDER BY avgRating DESC";

      pool.query(query, params, (err, rows) => {
         if (err) {
            reject(err);
         } else {
            resolve(rows);
         }
      });
   });
}

function findAllWithoutReviews(filters) {
   return new Promise((resolve, reject) => {
      let query = `
         SELECT a.* 
         FROM Article a 
         LEFT JOIN Reviews r ON a.id = r.productId 
         WHERE r.id IS NULL
      `;
      const params = [];

      if (filters.category && filters.category !== "") {
         query += " AND a.categoryId = ?";
         params.push(filters.category);
      }

      if (filters.maxPrice && !isNaN(filters.maxPrice)) {
         query += " AND a.price <= ?";
         params.push(parseFloat(filters.maxPrice));
      }

      pool.query(query, params, (err, rows) => {
         if (err) {
            reject(err);
         } else {
            resolve(rows);
         }
      });
   });
}

function findById(id) {
   return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Article WHERE id = ?", [id], (err, rows) => {
         if (err) {
            reject(err);
         } else {
            resolve(rows[0]);
         }
      });
   });
}

function create(articleData) {
   return new Promise((resolve, reject) => {
      const query = `
         INSERT INTO Article (name, description, price, categoryId, stock, imageUrl, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const values = [
         articleData.name,
         articleData.description,
         articleData.price,
         articleData.categoryId,
         articleData.stock,
         articleData.imageUrl,
      ];

      pool.query(query, values, (err, result) => {
         if (err) {
            reject(err);
         } else {
            resolve(result);
         }
      });
   });
}

function deleteById(articleId) {
   return new Promise((resolve, reject) => {
      pool.query(
         "DELETE FROM Article WHERE id = ?",
         [articleId],
         (err, result) => {
            if (err) {
               reject(err);
            } else {
               resolve(result);
            }
         }
      );
   });
}

module.exports = {
   findAll,
   findByFilters,
   findAllWithAvgRating,
   findAllWithoutReviews,
   findById,
   create,
   deleteById,
};
