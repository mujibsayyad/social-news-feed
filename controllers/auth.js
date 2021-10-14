const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
// const sendinBlue = require('nodemailer-sendinblue-transport');

const Posts = require("../models/post");
const User = require("../models/user");

const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en.json");
const post = require("../models/post");
TimeAgo.addLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

const transporter = nodemailer.createTransport({
  service: "SendinBlue", // no need to set host or port etc.
  auth: {
    user: process.env.sb_user,
    pass: process.env.sb_pass,
    api_key: process.env.sb_url,
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash("error", "No user found with this email");
      return res.redirect("/login");
    }

    bcrypt.compare(password, user.password).then((doMatch) => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;

        return req.session.save((err) => {
          // console.log(err);
          return res.redirect("/");
        });
      }
      req.flash("error", "Invalid Email or Password");
      res.redirect("/login");
    });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    // console.log(err);
    res.redirect("/");
  });
};

exports.getSignUp = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    errorMessage: message,
  });
};

exports.postSignUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userExist) => {
      if (userExist) {
        req.flash("error", "Email exists already, please pick different one.");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashPassword) => {
          const user = new User({
            name: name,
            email: email,
            password: hashPassword,
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "admin@socialnewsfeed.herokuapp.com",
            subject: "Signup succeeded!",
            html: `<h1>You Have successfully signed up!</h1>
                    <h1>click below link to login</h1><br>
                    <a href="https://socialnewsfeed.herokuapp.com/login">Click To Login</a>`,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "no account with this email found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");

        transporter.sendMail({
          to: req.body.email,
          from: "admin@socialnewsfeed.herokuapp.com",
          subject: "Password Reset!",
          html: `<p>You requested a password reset</p>
                   <p>click below link to reset password</p>
                   <a href="http://localhost:3000/reset/${token}">Click To Reset</a>`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash("error");

      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }

      res.render("auth/new-password", {
        pageTitle: "New Password",
        path: "/new-password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashPassword) => {
      resetUser.password = hashPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;

      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.userProfile = (req, res, next) => {
  const userId = req.params.user;
  console.log(userId);

  // Posts.find({ user: req.user?._id, post: req.post?._id })
  // Posts.find({ user: req.user?.id })
  Posts.find({ user: userId })
    .populate("user")
    .lean()
    .sort({ createdAt: -1 })
    .then((posts) => {
      // userPost = posts.filter((post) => post.name === req.user._id);

      updatedPosts = posts.map((post) => {
        return { ...post, time: timeAgo.format(post.createdAt) };
      });

      res.render("auth/user-profile", {
        path: "/profile",
        pageTitle: "Profile",
        post: updatedPosts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
