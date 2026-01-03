const pool = require("./pool");

function findAll() {
   return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Categories", (err, rows) => {
         if (err) {
            reject(err);
         } else {
            resolve(rows);
         }
      });
   });
}

module.exports = {
   findAll,
};
