const express = require('express');
const router = express.Router();

const { createShopping, getShoppingById, deleteShoppingById } = require('../controllers/shoppingController');

router.post('/create', createShopping)
router.get('/id_user/:id_users', getShoppingById)
router.delete('/id_shopping/:id_shopping', deleteShoppingById)

module.exports = router;