// MongoDB Model for user information
const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    notificationMessage: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
