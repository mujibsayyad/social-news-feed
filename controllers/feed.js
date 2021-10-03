const Posts = require('../models/post');

const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en.json');
TimeAgo.addDefaultLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

exports.getIndex = (req, res, next) => {
  Posts.find()
    .lean()
    .then((posts) => {
      updatedPosts = posts.map((post) => {
        return { ...post, time: timeAgo.format(post.createdAt) };
      });

      console.log(updatedPosts);
      res.render('index', {
        pageTitle: 'NewsFeed',
        path: '/',
        post: updatedPosts,
        // time: date,
        pTime: posts.createdAt,
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
