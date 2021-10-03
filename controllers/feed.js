const Posts = require('../models/post');

const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en.json');
TimeAgo.addDefaultLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

exports.getIndex = (req, res, next) => {
  updatedPosts = Posts.map((post) => {
    return { ...post, added: timeAgo.format() };
  });

  Posts.find()
    .then((post) => {
      res.render('index', {
        pageTitle: 'NewsFeed',
        path: '/',
        post: post,
        // time: date,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPost = (req, res, next) => {
  res.render('post', {
    pageTitle: 'Create Post',
    path: '/post',
  });
};

exports.postAddPost = (req, res, next) => {
  const title = req.body.title;

  const post = new Posts({
    title: title,
  });
  post
    .save()
    .then((result) => {
      console.log('Post Created');
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(post);
};
