var express = require('express');
var router = express.Router();
var passport = require('passport');

router.route('/login')
  .get(function(req, res, next) {
    res.render('login', { title: 'Login your account'});
  })
  .post(passport.authenticate('local', {
    failureRedirect: '/login'
  }), function (req, res) {
    res.redirect('/');
  });

router.route('/signup')
  .get(function(req, res, next) {
    res.render('signup', { title: 'Register a new account'});
  })
  .post(function(req, res, next) {
    req.checkBody('RegisterAs', 'Empty Name').notEmpty();
    req.checkBody('name', 'Empty Name').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('password', 'Empty Password').notEmpty();
    req.checkBody('password', 'Password do not match').equals(req.body.confirmPassword).notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      res.render('signup', {
        name: req.body.name,
        email: req.body.email,
        errorMessages: errors
      });
    } else {
      var user = new User();
      user.RegisterAs=req.body.RegisterAs;
      user.name = req.body.name;
      user.email = req.body.email;
      user.setPassword(req.body.password);
      user.save()
        .then(() => {
          res.redirect('/login');
        })
        .catch((err) => {
          res.render('signup', { errorMessages: err });
        });
    }
  });

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

// router.get('/auth/facebook/callback', passport.authenticate('facebook', {
//   successRedirect: '/',
//   failureRedirect: '/'
// }));

module.exports = router;
