// MongoDB model for Posts
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    username: {type:String,required:true},

    title: {type:String,required:true},

    body: {type:String,required:true},

    time: {
        type: Date,
        default: Date.now()
    },
    type: String,
    link: String,

    votes: {
        type: Number,
        default: 0
    },
    numOfComments: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Post', postSchema);
