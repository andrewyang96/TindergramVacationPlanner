var express = require('express');
var router = express.Router();

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://root@localhost:26257?sslmode=disable';
var rollback = function(client, done) {
  client.query('ROLLBACK', function(err) {
    return done(err);
  });
};

var K_VAL = 15;
var elo = require('elo-rank')(K_VAL);

router.get('*', function (req, res, next) {
  if (!req.user) res.status(401).send('You must login first');
  next();
});
/*
router.post('*', function (req, res, next) {
  if (!req.user) res.status(401).send('You must login first!');
  next();
});*/

router.get('/pair', function (req, res, next) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      done();
      return res.status(500).send(err);
    }
    client.query("SELECT city_name, placeholder_image FROM tgvp.cities ORDER BY RANDOM() LIMIT 2;", function (err, result) {
      done();
      if (err) return res.status(500).send(err);
      res.send(result.rows);
    });
  });
});

router.get('/cities', function (req, res, next) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      done();
      return res.status(500).send(err);
    }
    client.query("SELECT city_name, currency, rating FROM tgvp.cities ORDER BY rating DESC LIMIT 10;", function (err, result) {
      done();
      if (err) return res.status(500).send(err);
      res.send(result.rows);
    });
  });
});

router.post('/rate', function (req, res, next) {
  if (!req.body.winner || !req.body.loser) return res.status(400).send('Winner or loser not defined');
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      done();
      return res.status(500).send(err);
    }
    client.query("SELECT city_name, rating FROM tgvp.cities WHERE city_name in ($1, $2) " +
      "ORDER BY city_name=$1 DESC, city_name=$2 DESC;", [req.body.winner, req.body.loser],
      function (err, result) {
        if (err) {
          done();
          return res.status(500).send(err);
        }
        // calculate rating
        var winnerRating = Number(result.rows[0].rating);
        var loserRating = Number(result.rows[1].rating);
        var winnerExpectedScore = elo.getExpected(winnerRating, loserRating);
        var loserExpectedScore = elo.getExpected(loserRating, winnerRating);
        var updatedWinnerRating = elo.updateRating(winnerExpectedScore, 1, winnerRating);
        var updatedLoserRating = elo.updateRating(loserExpectedScore, 0, loserRating);

        client.query('BEGIN;', function (err) {
          if (err) return rollback(client, done);
          process.nextTick(function () {
            var stmt = 'UPDATE tgvp.cities SET rating = $1 WHERE city_name = $2;';
            client.query(stmt, [updatedWinnerRating, req.body.winner], function (err) {
              if (err) return rollback(client, done);
              client.query(stmt, [updatedLoserRating, req.body.loser], function (err) {
                if (err) return rollback(client, done);
                client.query('COMMIT;', function () {
                  done();
                  res.send();
                });
              });
            });
          });
        });
      });
  });
});

module.exports = router;
