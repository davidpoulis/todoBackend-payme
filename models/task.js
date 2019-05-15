var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Task = new Schema({
    title: {
        type : String,
        default : '',
        required:true
    },
    body:{
        type: String,
        default: ''
    },

    done:{
       type: Boolean,
       default: false
    },
    author:{
        type: String,
        ref: 'User',
        required:true

    }
 
},{timestamps: true});
module.exports = mongoose.model('Task', Task);