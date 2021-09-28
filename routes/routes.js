const express = require('express');

const router = express.Router();

const feedController = require('../controllers/feed');

router.get('/', feedController.getIndex);

router.get('/post', feedController.getPost);

router.post('/post', feedController.postAddPost);

module.exports = router;
