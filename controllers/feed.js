const mongoose = require('mongoose');

const Posts = require('../models/post');

const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en.json');
TimeAgo.addDefaultLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

exports.getIndex = (req, res, next) => {
  Posts.find()
    .populate('user')
    .lean()
    .sort({ createdAt: -1 })
    .then((posts) => {
      updatedPosts = posts.map((post) => {
        return { ...post, time: timeAgo.format(post.createdAt) };
      });

      console.log(posts);
      res.render('index', {
        pageTitle: 'NewsFeed',
        path: '/',
        post: updatedPosts,
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
  const user = req.userId;

  const post = new Posts({
    title: title,
    // userId: mongoose.Types.ObjectId(req.userId),
    user: req.user,
  });

  console.log(`-------------${req.user}`);

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

exports.getEditPost = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const postId = req.params.postId;
  Posts.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect('/');
      }
      res.render('edit-post', {
        pageTitle: 'Edit Post',
        path: '/edit-post',
        editing: editMode,
        post: post,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditPost = (req, res, next) => {
  const postId = req.body.postId;
  const updatedTitle = req.body.title;

  Posts.findById(postId)
    .then((post) => {
      post.title = updatedTitle;
      return post.save();
    })
    .then((result) => {
      console.log('POST UPDATED');
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeletePost = (req, res, next) => {
  const postId = req.body.postId;
  Posts.findByIdAndRemove(postId)
    .then(() => {
      console.log('POST DELETED');
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};
