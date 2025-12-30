const jwt = require("jsonwebtoken");

exports.getCurrentUser = (req, res) => {
   const authorizationValue = req.headers.authorization;

   if (!authorizationValue) {
      return res.status(401).json({ message: "Token manquant" });
   }

   const token = authorizationValue.split(" ")[1];

   try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      res.json({
         user: {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role,
         },
      });
   } catch (err) {
      console.error("Erreur lors de la vérification du token :", err);
      return res.status(401).json({ message: "Token invalide ou expiré" });
   }
};
