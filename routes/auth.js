const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');
const validator = require('../validators/auth');

router.get('/signup', validator.signUp, controller.signUp);
router.post('/register', validator.register, controller.register);
router.get('/signin', validator.signIn, controller.signIn);

module.exports = router;