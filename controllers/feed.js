const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en.json');

const FeedData = require('../models/feedData');

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

// const posts = [];

exports.getIndex = (req, res, next) => {
  // updatedPosts = posts.map((post) => {
  //   return { ...post, added: timeAgo.format(post.added) };
  // });

  res.render('index', {
    pageTitle: 'NewsFeed',
    path: '/',
    // post: updatedPosts,
    post: posts,
  });
};

exports.getPost = (req, res, next) => {
  const post = FeedData.fetchAll();

  res.render('post', {
    pageTitle: 'Create Post',
    path: '/post',
  });
};

exports.postAddPost = (req, res, next) => {
  const post = new FeedData(req.body.title);
  post.save();

  // FeedData.unshift({
  //   title: req.body.title,
  //   added: new Date(),
  // });

  res.redirect('/');

  console.log(posts);
};
