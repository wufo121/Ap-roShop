const articleQuery = require("../mysql/articleFunctionQuery");

function formatImageUrl(article) {
   if (article.imageUrl && !article.imageUrl.startsWith("/")) {
      article.imageUrl = `/${article.imageUrl}`;
   }
   return article;
}

function formatArticlesImageUrls(articles) {
   return articles.map(formatImageUrl);
}

async function getAllArticles() {
   try {
      const articles = await articleQuery.findAll();
      return formatArticlesImageUrls(articles);
   } catch (err) {
      console.error("Erreur lors de la récupération des articles :", err);
      throw err;
   }
}

async function getFilteredArticles(filters) {
   try {
      let articles;

      if (filters.sort === "bestRated") {
         articles = await articleQuery.findAllWithAvgRating(filters);
      } else if (filters.sort === "noRated") {
         articles = await articleQuery.findAllWithoutReviews(filters);
      } else {
         articles = await articleQuery.findByFilters(filters);
      }

      return formatArticlesImageUrls(articles);
   } catch (err) {
      console.error(
         "Erreur lors de la récupération des articles filtrés :",
         err
      );
      throw err;
   }
}

async function getArticleById(id) {
   try {
      const article = await articleQuery.findById(id);
      return article ? formatImageUrl(article) : null;
   } catch (err) {
      console.error(
         "Erreur lors de la récupération des données de l'article sélectionné",
         err
      );
      throw err;
   }
}

async function saveArticle(articleData) {
   try {
      const dataToSave = {
         name: articleData.name,
         description: articleData.description,
         price: articleData.price,
         categoryId: articleData.category,
         stock: articleData.stock,
         imageUrl: articleData.imagePath,
      };

      const result = await articleQuery.create(dataToSave);
      return result;
   } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'article :", err);
      throw err;
   }
}

async function deleteArticleById(articleId) {
   try {
      const article = await articleQuery.findById(articleId);
      const imageUrl = article?.imageUrl;

      const deleteResult = await articleQuery.deleteById(articleId);

      return { deleteResult, imageUrl };
   } catch (err) {
      console.error("Erreur lors de la suppression de l'article :", err);
      throw err;
   }
}

module.exports = {
   getAllArticles,
   saveArticle,
   deleteArticleById,
   getArticleById,
   getFilteredArticles,
};
