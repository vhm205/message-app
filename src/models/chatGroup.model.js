const mongoose = require('mongoose')

const ChatGroupSchema = new mongoose.Schema({
    name: String,
    userAmount: { type: Number, min: 3, max: 100 },
    messageAmount: { type: Number, default: 0 },
    userId: String,
    members: [
        { userId: String }
    ],
    createdAt: { type: Number, default: Date.now() },
    updatedAt: { type: Number, default: Date.now() },
    deletedAt: { type: Number, default: null }
})

ChatGroupSchema.statics = {
	createNew(item){
		return this.create(item)
	},
	updateChatGroupById(id, newMessageAmount){
		return this.findByIdAndUpdate(id, {
			'messageAmount': newMessageAmount,
			'updatedAt': Date.now()
		})
	},
	getChatGroupById(id){
		return this.findById(id)
	},
	getChatGroup(currentId, limit){
		return this.find({
			'members': {
				$elemMatch: { 'userId': currentId }
			}
		}).limit(limit)
	},
	getGroupByUserId(currentId){
		return this.find({
			'members': {
				$elemMatch: { 'userId': currentId }
			}
		}, { _id: 1 })
	}
}

module.exports = mongoose.model('ChatGroup', ChatGroupSchema)
