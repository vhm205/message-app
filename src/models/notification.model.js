const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    sender: {
        id: String,
        username: String,
        avatar: String
    },
    receiver: {
        id: String,
        username: String,
        avatar: String
    },
    type: String,
    content: String,
    isReaded: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() }
})

module.exports = mongoose.model('Notification', NotificationSchema)