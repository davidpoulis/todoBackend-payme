
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var authenticate = require('../authenticate');
var passport = require('passport');
var cors = require('./cors');
/* GET users listing. */

router.options('/',cors.corsWithOptions, (req, res) => { res.sendStatus(200); });
router.get('/',cors.cors,authenticate.verifyUser ,(req, res, next)=>{
  User.find({},{password:0,username:0})
  .then((users)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  },(err) =>next(err))
  .catch((err)=>next(err));
});


router.route('/signup')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, (req, res, next) => {

  User.register(new User({username: req.body.username, email: req.body.email}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        var token = authenticate.getToken({_id: user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        res.json({success: true, status: 'Registration Successful!',token: token});
      });
    }
  });
});

router.options('/checkJWTToken',cors.corsWithOptions, (req, res) => { res.sendStatus(200); });
router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});

router.options('/login',cors.corsWithOptions, (req, res) => { res.sendStatus(200); });
router.post('/login',cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  
  res.json({success: true,token: token ,status: 'You are successfully logged in!'});
});

module.exports = router;
