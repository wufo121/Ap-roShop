const express = require("express");
const app = express();
const mysql = require("mysql");
const port = 3000;



app.get("/", (req, res) => {
   const connection = mysql.createConnection({
      host: "localhost",
      user: "eCommerce",
      password: "test",
      database: "eCommerce",
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
