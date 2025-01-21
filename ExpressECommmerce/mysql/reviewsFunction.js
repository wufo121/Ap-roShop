const pool = require("./pool");

function getReviews(articleId) {
   return new Promise((resolve, reject) => {
      const query = `
            SELECT 
                Reviews.*,
                Users.username
            FROM Reviews
            INNER JOIN Users ON Reviews.userId = Users.id
            WHERE Reviews.productId = ?
            ORDER BY Reviews.createdAt DESC
        `;

      pool.query(query, [articleId], (error, results) => {
         if (error) {
            reject(error);
            return;
         }
         resolve(results);
      });
   });
}

function addReviews(productId, userId, rating, comment) {
   return new Promise((resolve, reject) => {
      const query = `
      INSERT INTO Reviews (productId,userId,rating,comment,createdAt)
      VALUES (?,?,?,?,NOW())
      `;
      pool.query(
         query,
         [productId, userId, rating, comment],
         (error, results) => {
            if (error) {
               reject(error);
               return;
            }
            resolve(results);
         }
      );
   });
}

function getNoteReviews(articleId) {
   return new Promise((resolve, reject) => {
      const query = `
      SELECT rating FROM Reviews
      WHERE Reviews.productId = ?
      `;
      pool.query(query, [articleId], (error, results) => {
         if (error) {
            reject(error);
            return;
         }
         resolve(results);
      });
   });
}

module.exports = {
   getReviews,
   addReviews,
   getNoteReviews,
};
