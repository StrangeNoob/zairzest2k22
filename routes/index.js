const express = require('express');
const router = express();

const auth = require('./auth');
const event = require('./event');



router.use('/auth',auth);
router.use('/events', event);

module.exports = router;