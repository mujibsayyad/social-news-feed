require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDbSession = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const User = require('./models/user');
const errorController = require('./controllers/error');

const app = express();

const MONGODB_URI = process.env.db_url;

const mongoStoreSession = new mongoDbSession({
  uri: MONGODB_URI,
  collection: 'sessions',
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const feedRoutes = require('./routes/routes');
const authRoutes = require('./routes/authRoutes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

app.use(
  session({
    secret: 'my secret dont look here',
    resave: false,
    saveUninitialized: false,
    store: mongoStoreSession,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })

    .catch((err) => {
      next(new Error(err));
    });
});

app.use(feedRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
