const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en.json');
const Posts = require('../models/post');

TimeAgo.addDefaultLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

// Home Page (Index)
exports.getIndex = (req, res, next) => {
  Posts.find()
    .populate('user')
    .lean()
    .sort({ createdAt: -1 })
    .then((posts) => {
      updatedPosts = posts.map((post) => {
        return { ...post, time: timeAgo.format(post.createdAt) };
      });

      res.render('index', {
        pageTitle: 'NewsFeed',
        path: '/',
        post: updatedPosts,
      });
    })
    .catch((err) => {
      // console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getPost = (req, res, next) => {
  res.render('post', {
    pageTitle: 'Create Post',
    path: '/post',
  });
};

// Post Page
exports.postAddPost = (req, res, next) => {
  const title = req.body.title;

  const post = new Posts({
    title: title,
    user: req.user,
  });

  post
    .save()
    .then((result) => {
      console.log('Post Created');
      res.redirect('/');
    })
    .catch((err) => {
      // console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Edit Post
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
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Post Edited Post
exports.postEditPost = (req, res, next) => {
  const postId = req.body.postId;
  const updatedTitle = req.body.title;

  Posts.findById(postId)
    .then((post) => {
      if (post.user.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      post.title = updatedTitle;
      return post.save().then((result) => {
        console.log('POST UPDATED');
        res.redirect('/');
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Delete Post
exports.postDeletePost = (req, res, next) => {
  const postId = req.body.postId;
  Posts.deleteOne({ _id: postId, user: req.user._id })
    .then(() => {
      console.log('POST DELETED');
      res.redirect('/');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// About Us Page
exports.aboutUs = (req, res, next) => {
  res.render('about', {
    pageTitle: 'About Us',
    path: '/about',
  });
};
