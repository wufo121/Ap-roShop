const pool = require("./pool");

function getAllArticles() {
   return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Article", (err, rows) => {
         if (err) {
            console.error("Erreur lors de la récupération des articles :", err);
            reject(err);
         } else {
            resolve(rows);
         }
      });
   });
}

module.exports = {
   getAllArticles,
};
