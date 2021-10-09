const express = require('express');

const router = express.Router();

const indexController = require('../controllers/index');

router.get('/login', indexController.getLogin);

router.post('/login', indexController.postLogin);

module.exports = router;
