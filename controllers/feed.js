const posts = [];

exports.getIndex = (req, res, next) => {
  res.render('index', {
    pageTitle: 'NewsFeed',
    path: '/',
    post: posts,
  });
};

exports.getPost = (req, res, next) => {
  res.render('post', {
    pageTitle: 'Create Post',
    path: '/post',
  });
};

exports.postAddPost = (req, res, next) => {
  posts.unshift({ title: req.body.title, added: new Date() });

  res.redirect('/');
};
