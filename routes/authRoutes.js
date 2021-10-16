const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const { check, body } = require('express-validator');
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignUp);

router.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),

    body('password', 'Password has to be valid.')
      .isLength({ min: 2 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userExist) => {
          if (userExist) {
            return Promise.reject(
              'Email exists already, please pick different one.'
            );
          }
        });
      })
      .normalizeEmail(),

    body(
      'password',
      'please enter a password with only numbers and text and at least 6 characters.'
    )
      .isLength({ min: 2 })
      .isAlphanumeric()
      .trim(),

    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password do not match');
        }
        return true;
      }),
  ],

  authController.postSignUp
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

router.get('/profile/:user', authController.userProfile);

module.exports = router;
