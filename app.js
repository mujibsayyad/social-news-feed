const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./models/user');

const app = express();

const MONGODB_URI = process.env.db_url;

const feedRoutes = require('./routes/routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(feedRoutes);

app.use((req, res, next) => {
  User.findById('615eb24976fe5dcd7f35f769')
    .then((user) => {
      req.user = user;
      console.log(req.user + '/////////////////////////////');
      next();
    })

    .catch((err) => {
      console.log(err);
    });
});

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
