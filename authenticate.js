var passport = require('passport');
var LocalStrategy = require('passport-local');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
  return jwt.sign(user,"1234-5678-9876",
        {expiresIn:259200}); //expire after 3 days
};

var opts ={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "1234-5678-9876";

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload,done) =>{
        console.log("JWT payload: ",jwt_payload);
        User.findOne({_id:jwt_payload._id} ,(err,user)=>{
            if(err){
                return done(err,false);
            }
            else if (user){
                return done(null,user)
            }
            else {
                return done(null,false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt',{session:false});
