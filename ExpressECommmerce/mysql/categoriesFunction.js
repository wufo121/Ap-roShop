const pool = require("./pool");

function getAllCategories() {
   return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Categories", (err, rows) => {
         if (err) {
            console.error(
               "Erreur lors de la récupération des catégories :",
               err
            );
            reject(err);
         } else {
            resolve(rows);
         }
      });
   });
}

module.exports = {
   getAllCategories,
};
