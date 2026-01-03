const pool = require("./pool");

function findByProductId(productId) {
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

      pool.query(query, [productId], (error, results) => {
         if (error) {
            reject(error);
         } else {
            resolve(results);
         }
      });
   });
}

function create(productId, userId, rating, comment) {
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
            } else {
               resolve(results);
            }
         }
      );
   });
}

function findRatingsByProductId(productId) {
   return new Promise((resolve, reject) => {
      const query = `
      SELECT rating FROM Reviews
      WHERE Reviews.productId = ?
      `;
      pool.query(query, [productId], (error, results) => {
         if (error) {
            reject(error);
         } else {
            resolve(results);
         }
      });
   });
}

module.exports = {
   findByProductId,
   create,
   findRatingsByProductId,
};
