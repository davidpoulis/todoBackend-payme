var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  
    email:{
        type:String 
    }
 
});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);