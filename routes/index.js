var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', passport.authenticate('facebook'));

router.get('/login/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
  function (req, res) {
    res.send(req.user);
  });

module.exports = router;
