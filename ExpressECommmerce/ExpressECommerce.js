const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const article = require("./router/article");
const login = require("./router/login");
const me = require("./router/me");
const register = require("./router/register");

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

app.use(
   "/imagesArticle",
   express.static(path.join(__dirname, "public/imagesArticle"))
);

app.use(
   "/imagesArticle",
   express.static(path.join(__dirname, "public/imagesArticle"))
);

app.use(express.json());

app.use("/api", article);

app.use("/api", login);

app.use("/api", me);

app.use("/api", register);

app.listen(port, () => {
   console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
