const express = require('express');

const router = express.Router();

const feedController = require('../controllers/feed');

const isAuth = require('../middleware/is-auth');

router.get('/', feedController.getIndex);

router.get('/about', feedController.aboutUs);

router.get('/post', isAuth, feedController.getPost);

router.post('/post', isAuth, feedController.postAddPost);

router.get('/edit-post/:postId', isAuth, feedController.getEditPost);

router.post('/edit-post', isAuth, feedController.postEditPost);

router.post('/delete-post', isAuth, feedController.postDeletePost);

module.exports = router;
