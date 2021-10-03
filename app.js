const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const feedRoutes = require('./routes/routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(feedRoutes);

app.listen(process.env.PORT || 3000);
