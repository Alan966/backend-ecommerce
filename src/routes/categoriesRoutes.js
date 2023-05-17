const express = require('express');
const router = express.Router();

const { getCategorys, createCategory } = require('../controllers/categoriesController.js')

router.get('/', getCategorys)

router.post('/', createCategory)

module.exports = router;