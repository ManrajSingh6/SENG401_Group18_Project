const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    
    username: {type:String,required:true},

    body: {type:String,required:true},

    time: {
        type: Date,
        default: Date.now()
    },
  
    votes: {
        type: Number,
        default: 0
    },

    postId: {type:mongoose.ObjectId,required:false},
});

module.exports = mongoose.model('Comment', commentSchema);
