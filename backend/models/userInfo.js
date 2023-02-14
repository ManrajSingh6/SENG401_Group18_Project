// MongoDB Model for user information
const mongoose = require('mongoose');

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
    created: Date,
    savedPosts: Array,
    savedComments: Array,
    subscribed: Array,
    owned: Array
});

module.exports = mongoose.model('User', userSchema);
