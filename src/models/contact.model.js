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
    }
}

module.exports = mongoose.model('Contact', ContactSchema)
