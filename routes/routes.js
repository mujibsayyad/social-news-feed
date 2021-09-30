const express = require('express');

const router = express.Router();

const feedController = require('../controllers/feed');
const indexController = require('../controllers/index');

router.get('/', feedController.getIndex);

router.get('/post', feedController.getPost);

router.post('/post', feedController.postAddPost);

router.get('/login', indexController.getLogin);

module.exports = router;
