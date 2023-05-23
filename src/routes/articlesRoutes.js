const express = require('express');
const router = express.Router();

const { createArticle, getArticleByIdPromotion, getPhotoByIdArticle, allArticles } = require('../controllers/articlesControllers.js');

router.post('/create', createArticle);
router.get('/id_promotion/:id_promotion', getArticleByIdPromotion);
router.get('/id_article/:img/:id_article', getPhotoByIdArticle);
router.get('/list', allArticles)

module.exports = router;