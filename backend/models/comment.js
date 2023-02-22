const mongoose = require('mongoose');
const {Schema,model} = mongoose;
const commentSchema = new mongoose.Schema({
    author: {type:Schema.Types.ObjectId,ref:'User'},

    body: {type:String,required:true},

    time: {
        type: Date,
        default: Date.now()
    },
  
    votes: [{type:Schema.Types.ObjectId,ref:'Vote'}],

    postId: {type:mongoose.ObjectId,required:true},
});

module.exports = mongoose.model('Comment', commentSchema);
