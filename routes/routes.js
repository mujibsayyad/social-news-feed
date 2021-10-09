const express = require('express');

const router = express.Router();

const feedController = require('../controllers/feed');

router.get('/', feedController.getIndex);

router.get('/post', feedController.getPost);

router.post('/post', feedController.postAddPost);

router.get('/edit-post/:postId', feedController.getEditPost);

router.post('/edit-post', feedController.postEditPost);

router.post('/delete-post', feedController.postDeletePost);

module.exports = router;
