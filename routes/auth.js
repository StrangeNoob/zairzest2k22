const express = require('express');
const router = express.Router();

const controller = require('./controllers/auth');
const validator = require('./validators/auth');

router.post('/signin', validator.signIn, controller.signIn);
