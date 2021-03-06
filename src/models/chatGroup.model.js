const mongoose = require('mongoose')

const ChatGroupSchema = new mongoose.Schema({
    name: String,
    userAmount: { type: Number, min: 3, max: 100 },
    messageAmount: { type: Number, default: 0 },
    userId: String,
    members: [
		{ _id: false, userId: String }
    ],
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
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
	checkExists(currentId, name){
		return this.findOne({
			'name': name,
			'userId': currentId
		}, { _id: 1 })
	},
	checkUserInGroup(currentId, groupId){
		return this.findOne({
			'_id': groupId,
			'members': {
				$elemMatch: { 'userId': currentId }
			}
		}, { _id: 1, userAmount: 1 })
	},
	leaveGroupChat(currentId, groupId, userAmount){
		return this.updateOne(
			{ '_id': groupId },
			{
				$pull: {
					'members': { 'userId': currentId }
				},
				'userAmount': userAmount
			}
		)
	},
	getChatGroupById(id){
		return this.findById(id)
	},
	getChatGroup(currentId, limit){
		return this.find({
			'members': {
				$elemMatch: { 'userId': currentId }
			}
		}).sort({ 'updatedAt': -1 }).limit(limit)
	},
	readMoreChatGroupRemaning(currentId, skip, timestamp){
		return this.find({
			$and: [
				{'members': {
					$elemMatch: { 'userId': currentId }
				}},
				{ 'updatedAt': { $gt: timestamp } }
			]
		}).sort({ 'updatedAt': -1 }).skip(skip)
	},
	readMoreChatGroup(currentId, skip, limit){
		return this.find({
			'members': {
				$elemMatch: { 'userId': currentId }
			}
		}).sort({ 'updatedAt': -1 }).skip(skip).limit(limit)
	},
	getGroupIdByUserId(currentId){
		return this.find({
			'members': {
				$elemMatch: { 'userId': currentId }
			}
		}, { _id: 1 })
	}
}

module.exports = mongoose.model('ChatGroup', ChatGroupSchema)
