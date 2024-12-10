const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

const pool = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
});

app.get("/api/articles", (req, res) => {
   pool.query("SELECT * FROM Article", (err, rows) => {
      if (err) {
         console.error("Erreur lors de la récupération des articles :", err);
         return res.status(500).json({ message: "Erreur serveur" });
      }
      res.json(rows);
   });
});

app.post("/api/login", (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      return res
         .status(400)
         .json({ message: "L'email et le mot de passe sont nécessaires" });
   }

   const query = "SELECT * FROM Users WHERE email = ?";
   pool.query(query, [email], (err, results) => {
      if (err) {
         console.error(
            "Erreur lors de la vérification des utilisateurs :",
            err
         );
         return res.status(500).json({ message: "Erreur serveur" });
      }

      if (results.length === 0) {
         return res.status(401).json({ message: "Identifiants invalides" });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
         if (err) {
            console.error(
               "Erreur lors de la comparaison du mot de passe :",
               err
            );
            return res.status(500).json({ message: "Erreur serveur" });
         }

         if (!isMatch) {
            return res.status(401).json({ message: "Identifiants invalides" });
         }

         res.json({
            message: "Connexion réussie",
            user: { id: user.id, username: user.username, role: user.role },
         });
      });
   });
});

app.post("/api/register", (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      return res
         .status(400)
         .json({ message: "L'email et le mot de passe sont nécessaires" });
   }
   const checkEmailQuery = "SELECT * FROM Users WHERE email = ?";
   pool.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
         console.error("Erreur lors de la verification de l'email :", err);
         return res.status(500).json({ message: "Erreur serveur" });
      }
      if (results.length > 0) {
         return res.status(400).json({ message: "L'email est déjà utilisé" });
      }
      bcrypt.hash(password, 10, (err, hashedPassword) => {
         if (err) {
            console.error("Erreur lors du hachage du mot de passe :", err);
            return res.status(500).json({ message: "Erreur serveur" });
         }
         const username = email.split("@")[0];
         const insertQuery =
            "INSERT INTO Users (email, password, username, role) VALUES (?, ?, ?, ?)";
         pool.query(
            insertQuery,
            [email, hashedPassword, username, "client"],
            (err, results) => {
               if (err) {
                  console.error("Erreur lors de l'inscription :", err);
                  return res.status(500).json({ message: "Erreur serveur" });
               }
               res.status(201).json({ message: "Inscription réussie" });
            }
         );
      });
   });
});

app.listen(port, () => {
   console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
