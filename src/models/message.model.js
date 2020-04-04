const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
		senderId: String,
		receiverId: String,
		messageType: String,
		conversationType: String,
    sender: {
        id: String,
        name: String,
        avatar: String
    },
    receiver: {
        id: String,
        name: String,
        avatar: String
    },
    text: String,
    file: {
        data: Buffer,
        contentType: String,
        fileName: String
    },
    createdAt: { type: Number, default: Date.now() },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null }
})

MessageSchema.statics = {
	createNew(item){
		return this.create(item)
	},
	getMessagesInPersonal(senderId, receiverId, limit){
		return this.find({
			$or: [
				{
					$and: [
						{'senderId': senderId},
						{'receiverId': receiverId},
					]
				},
				{
					$and: [
						{'senderId': receiverId},
						{'receiverId': senderId},
					]
				}
			]
		}).sort({ 'createdAt': 1 }).limit(limit)
	},
	getMessagesInGroup(receiverId, limit){
		return this.find({'receiverId': receiverId}).sort({ 'createdAt': 1 }).limit(limit)
	}
}

const CONVERSATION_TYPE = {
	PERSONAL: 'personal',
	GROUP: 'group'
}

const MESSAGE_TYPE = {
	TEXT: 'text',
	IMAGE: 'image',
	FILE: 'file'
}

module.exports = {
	messageModel: mongoose.model('Message', MessageSchema),
	conversationType: CONVERSATION_TYPE,
	messageType: MESSAGE_TYPE
}
