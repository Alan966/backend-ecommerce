const express = require('express');
const router = express.Router();

const { setPromotionsDatabase, allPromotionsWelcome, getPhotoPromotiosn } = require('../controllers/promotionsController.js')

router.get('/', allPromotionsWelcome)
router.get('/photo/:id_promotion', getPhotoPromotiosn)

router.post('/', setPromotionsDatabase)

module.exports = router;