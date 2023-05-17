const express =  require('express');
const router = express.Router();

const  {  getAllSubcategories, createSubcategorie, getSubcategorysByIdCategory } = require('../controllers/subCategoriesContoller.js');
router.get('/', getAllSubcategories)

router.get('/:id_category', getSubcategorysByIdCategory)

router.post('/', createSubcategorie)

module.exports = router;