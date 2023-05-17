const express = require('express');
const router = express.Router();

const { signin } = require('../controllers/signinControllers.js');
router.post('/', signin);

router.get('/', (req, res) => {
    res.send('Signin page');
})

module.exports = router;