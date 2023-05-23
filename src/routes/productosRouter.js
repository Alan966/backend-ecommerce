const express = require('express');
const router = express.Router();

const { createProducto, getProductoBySubcategory, getPhotobySubcategory, getProductoByCategory, getImgByIdProdcuto, getProductosByIdSubcategory, getProductsByIdUsers} = require('../controllers/productosController.js');

router.post('/create', createProducto);
router.get('/id_sucategorie/:id_subcategories', getProductoBySubcategory);
router.get('/id_category/:id_category', getProductoByCategory)
router.get('/id_subcategory/:id_subcategories', getProductosByIdSubcategory)
router.get(`/img/:img/:id_producto`, getImgByIdProdcuto)
router.get('/id_users/:id_users', getProductsByIdUsers)
router.get('/:img/:id_subcategories', getPhotobySubcategory);

module.exports = router;