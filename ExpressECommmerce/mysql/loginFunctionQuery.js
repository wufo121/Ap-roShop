const pool = require("./pool");

function findByEmail(email) {
   return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Users WHERE email = ?";
      pool.query(query, [email], (err, results) => {
         if (err) {
            reject(err);
         } else {
            resolve(results[0]);
         }
      });
   });
}

module.exports = {
   findByEmail,
};
