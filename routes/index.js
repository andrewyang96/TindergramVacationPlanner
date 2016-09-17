var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
    user: req.user,
  });
});

router.get('/login', passport.authenticate('facebook'));

router.get('/login/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/');
  });

router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
