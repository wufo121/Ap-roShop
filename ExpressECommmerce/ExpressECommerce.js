const express = require("express");
const app = express();
const mysql = require("mysql");
const port = 3000;
const dotenv = require("dotenv");

dotenv.config();

app.get("/", (req, res) => {
   const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
   });

   connection.connect((err) => {
      if (err) {
         console.error("erreur de connexion : " + err.stack);
         return;
      }
   });

   connection.query("SELECT * FROM Article", (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
   });
});

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});
