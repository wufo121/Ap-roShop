const pool = require("./pool");

function findCartByUserId(userId) {
   return new Promise((resolve, reject) => {
      const query = "SELECT id FROM Cart WHERE userId = ?";
      pool.query(query, [userId], (error, results) => {
         if (error) return reject(error);
         resolve(results[0]);
      });
   });
}

function createCart(userId) {
   return new Promise((resolve, reject) => {
      const query =
         "INSERT INTO Cart (userId, createdAt, updatedAt) VALUES (?, NOW(), NOW())";
      pool.query(query, [userId], (error, results) => {
         if (error) return reject(error);
         resolve(results.insertId);
      });
   });
}

function addOrUpdateCartItem(cartId, productId, quantity) {
   return new Promise((resolve, reject) => {
      const query = `
      INSERT INTO Cart_items (cartId, productId, quantity, price)
      SELECT ?, ?, ?, article.price * ?
      FROM Article article
      WHERE article.id = ?
      ON DUPLICATE KEY UPDATE 
         quantity = Cart_items.quantity + VALUES(quantity),
         price = Cart_items.quantity * article.price;
      `;

      pool.query(
         query,
         [cartId, productId, quantity, quantity, productId],
         (error, results) => {
            if (error) return reject(error);
            resolve({ id: results.insertId, productId, quantity });
         }
      );
   });
}

function findCartItemsByUserId(userId) {
   return new Promise((resolve, reject) => {
      const query = `
      SELECT 
        Cart_items.*,
        Article.name AS productName,
        Article.imageUrl
      FROM 
        Cart_items
      INNER JOIN 
        Article ON Cart_items.productId = Article.id
      INNER JOIN
        Cart ON Cart_items.cartId = Cart.id
      WHERE
        Cart.userId = ?;
    `;

      pool.query(query, [userId], (error, results) => {
         if (error) return reject(error);
         resolve(results);
      });
   });
}

function deleteCartItem(userId, productId) {
   return new Promise((resolve, reject) => {
      const query = `
      DELETE Cart_items
      FROM Cart_items
      INNER JOIN Cart ON Cart_items.cartId = Cart.id
      WHERE Cart.userId = ? AND Cart_items.productId = ?;`;

      pool.query(query, [userId, productId], (error, results) => {
         if (error) return reject(error);
         resolve(results);
      });
   });
}

module.exports = {
   findCartByUserId,
   createCart,
   addOrUpdateCartItem,
   findCartItemsByUserId,
   deleteCartItem,
};
