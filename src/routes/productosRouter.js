const express = require('express');
const router = express.Router();

const { createProducto } = require('../controllers/productosController.js');

router.post('/create', createProducto);

module.exports = router;