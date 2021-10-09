const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDbSession = require('connect-mongodb-session')(session);

const User = require('./models/user');

const app = express();

const MONGODB_URI = process.env.db_url;


const mongoStoreSession = new mongoDbSession({
  uri: MONGODB_URI,
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const feedRoutes = require('./routes/routes');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'my secret dont look here',
    resave: false,
    saveUninitialized: false,
    store: mongoStoreSession,
  })
);

app.use((req, res, next) => {
  User.findById('615eb24976fe5dcd7f35f769')
    .then((user) => {
      req.user = user;
      next();
    })

    .catch((err) => {
      console.log(err);
    });
});

app.use(feedRoutes);
app.use(authRoutes);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Mujib',
          email: 'mujib@mujib.mujib',
          post: [],
        });
        user.save();
      }
    });

    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
