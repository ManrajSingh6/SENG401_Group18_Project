// MongoDB model for Posts
const mongoose = require('mongoose');
const {Schema,model} = mongoose;
const postSchema = new mongoose.Schema({
    author: {type:Schema.Types.ObjectId,ref:'User'},
    title: {type:String,required:true},
    summary: {type: String, required: true},
    body: {type:String,required:true},
    thread:{type:Schema.Types.ObjectId,ref:'Thread'},
    time: {
        type: Date,
        default: Date.now()
    },
    type: String,
    link: String,
    votes: [{type:Schema.Types.ObjectId,ref:'Vote'}],
    comments: [{type:Schema.Types.ObjectId,ref:'Comments'}],
    postImgUrl: String
});

module.exports = mongoose.model('Post', postSchema);
