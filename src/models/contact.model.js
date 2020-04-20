const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
    userId: String,
    contactId: String,
    status: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null }
})

ContactSchema.statics = {
	createNew(item){
		return this.create(item)
	},
	findAllByUser(currentId){
		return this.find({
			$or: [
				{ 'userId': currentId },
				{ 'contactId': currentId }
			]
		})
	},
	findContactsHaveBeenFriends(currentId){
		return this.find({
			$and: [
				{
					$or: [
						{ 'userId': currentId },
						{ 'contactId': currentId }
					]
				},
				{ 'status': true }
			]
			
		})
	},
	checkExists(currentId, contactId){
		return this.findOne({
			$or: [
				{
					$and: [
						{ 'userId': currentId },
						{ 'contactId': contactId }
					]
				},
				{
					$and: [
						{ 'userId': contactId },
						{ 'contactId': currentId }
					]
				}
			]
		})
	},
	updateContactWhenHasMessage(currentId, contactId){
		return this.updateOne({
			$or: [
				{
					$and: [
						{ 'userId': currentId },
						{ 'contactId': contactId }
					]
				},
				{
					$and: [
						{ 'userId': contactId },
						{ 'contactId': currentId }
					]
				}
			]
		}, { 'updatedAt': Date.now() })
	},
	removeContact(currentId, contactId){
		return this.deleteOne({
			$or: [
				{
					$and: [
						{ 'userId': currentId },
						{ 'contactId': contactId },
						{ 'status': true },
					]
				},
				{
					$and: [
						{ 'userId': contactId },
						{ 'contactId': currentId },
						{ 'status': true },
					]
				}
			]
		})
	},
	removeRequestContact(currentId, contactId){
		return this.deleteOne({
			$and: [
				{ 'userId': currentId },
				{ 'contactId': contactId },
				{ 'status': false }
			]
		})
	},
	removeRequestContactReceived(currentId, contactId){
		return this.deleteOne({
			$and: [
				{ 'contactId': currentId },
				{ 'userId': contactId },
				{ 'status': false }
			]
		})
	},
	acceptRequestContactReceived(currentId, contactId){
		return this.updateOne({
			$and: [
				{ 'contactId': currentId },
				{ 'userId': contactId },
				{ 'status': false }
			]
		}, { 'status': true, 'updatedAt': Date.now() })
	},
	getContacts(currentId, limit){
		return this.find({
			$and: [
				{
					$or: [
						{ 'userId': currentId },
						{ 'contactId': currentId }
					]
				},
				{ 'status': true }
			]
		}).sort({ 'updatedAt': -1 }).limit(limit)
	},
	getContactsSent(currentId, limit){
		return this.find({
			$and: [
				{ 'userId' : currentId },
				{ 'status': false }
			]
		}).sort({ 'createdAt': -1 }).limit(limit)
	},
	getContactsReceived(currentId, limit){
		return this.find({
			$and: [
				{ 'contactId' : currentId },
				{ 'status': false }
			]
		}).sort({ 'createdAt': -1 }).limit(limit)
	},
	countAllContacts(currentId){
		return this.countDocuments({
			$and: [
				{
					$or: [
						{ 'userId': currentId },
						{ 'contactId': currentId }
					]
				},
				{ 'status': true }
			]
		})
	},
	countAllContactsSend(currentId){
		return this.countDocuments({
			$and: [
				{ 'userId' : currentId },
				{ 'status': false }
			]
		})
	},
	countAllContactsReceived(currentId){
		return this.countDocuments({
			$and: [
				{ 'contactId' : currentId },
				{ 'status': false }
			]
		})
	},
	readMoreContacts(currentId, skip, limit){
		return this.find({
			$and: [
				{
					$or: [
						{ 'userId': currentId },
						{ 'contactId': currentId }
					]
				},
				{ 'status': true }
			]
		}).sort({ 'updatedAt': -1 }).skip(skip).limit(limit)
	},
	readMoreContactsSent(currentId, skip, limit){
		return this.find({
			$and: [
				{ 'userId' : currentId },
				{ 'status': false }
			]
		}).sort({ 'createdAt': -1 }).skip(skip).limit(limit)
	},
	readMoreContactsReceived(currentId, skip, limit){
		return this.find({
			$and: [
				{ 'contactId' : currentId },
				{ 'status': false }
			]
		}).sort({ 'createdAt': -1 }).skip(skip).limit(limit)
	}
}

module.exports = mongoose.model('Contact', ContactSchema)
