const express = require('express');
const router = express.Router();

const { createUser } = require('../controllers/signupControllers');

router.post('/', createUser)

router.get('/', (req, res) => {
    res.send('Signup page');
})

module.exports = router;