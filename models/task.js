var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Task = new Schema({
    title: {
        type : String,
        default : '',
        required:true
    },
    subtitle:{
        type: String,
        default: '',
        required:true

    },

    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
 
},{timestamps: true});
module.exports = mongoose.model('Task', Task);