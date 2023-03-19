// MongoDB Model for user information
const mongoose = require('mongoose');
const {Schema,model} = mongoose;
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    posts: [{type:Schema.Types.ObjectId,ref:'Post'}],
    comments: [{type:Schema.Types.ObjectId,ref:'Comment'}],
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    subscribed: [{type:Schema.Types.ObjectId,ref:'Thread'}],
    description: {type: String, default: "You have yet to add a description."},
    profilePicture: {type: String, default: "uploads\\defaultUserProPic.png"}
});

module.exports = mongoose.model('User', userSchema);
