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

function findByUsername(username) {
   return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Users WHERE username = ?";
      pool.query(query, [username], (err, results) => {
         if (err) {
            reject(err);
         } else {
            resolve(results[0]);
         }
      });
   });
}

function createUser(username, email, address, hashedPassword) {
   return new Promise((resolve, reject) => {
      const query =
         "INSERT INTO Users (username, email, address, password, role, createdAt) VALUES (?, ?, ?, ?, ?, NOW())";
      pool.query(
         query,
         [username, email, address, hashedPassword, "client"],
         (err, results) => {
            if (err) {
               reject(err);
            } else {
               resolve(results.insertId);
            }
         }
      );
   });
}

module.exports = {
   findByEmail,
   findByUsername,
   createUser,
};
