var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var gameId=req.params.gameid;
  res.render('index', {
    title: 'Arena',
    gameId: ''
  });
  // res.send('Username: ' + req.body.username);
});
router.get('/snakeLadder/:gameid', function(req, res, next) {
  var gameId=req.params.gameid;
  res.render('index', {
    title: 'Arena',
    gameId: gameId
  });
  // res.send('Username: ' + req.body.username);
});

// router.get('/snakeLadder', function(req, res, next) {
//   res.render('snakeLadder', {
//     title: 'Snake Ladder',
//     gameHost: req.body.gameHost
//   });
// });

router.post('/snakeLadder', function(req, res, next) {
  var d={
    title: 'Snake Ladder',
    user: {
      name:req.body.user_name,
      isHost:req.body.isHost
    },
    gameId:req.body.gameId
  }
  res.render('snakeLadder', d);

});

module.exports = router;
