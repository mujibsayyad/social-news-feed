const express = require('express');

const router = express.Router();

const feedController = require('../controllers/feed');
const indexController = require('../controllers/index');

router.get('/', feedController.getIndex);

router.get('/post', feedController.getPost);

router.post('/post', feedController.postAddPost);

// router.post('/post/postId', feedController.postAddPost);

router.get('/login', indexController.getLogin);

router.get('/edit-post/:postId', feedController.getEditPost);

router.post('/edit-post', feedController.postEditPost);

module.exports = router;
