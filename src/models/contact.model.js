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
	
    findAllByUser(id){
        return this.find({
            $or: [
                { 'userId': id },
                { 'contactId': id }
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
	
    removeRequestContact(currentId, contactId){
        return this.deleteOne({
            $and: [
                { 'userId': currentId },
                { 'contactId': contactId }
            ]
        })
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
		}).sort({ 'createdAt': -1 }).limit(limit)
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
	}
}

module.exports = mongoose.model('Contact', ContactSchema)
