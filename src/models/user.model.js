const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: { type: String, min: 3 },
    gender: { type: String, default: "male" },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    avatar: { type: String, default: 'avatar-default.png' },
    role: { type: String, default: 'user' },
    local: {
        email: { type: String, trim: true },
        password: { type: String, min: 6 },
        isActive: { type: Boolean, default: false },
        verifyToken: String
    },
    facebook: {
        uid: String,
        token: String,
        email: { type: String, trim: true }
    },
    google: {
        uid: String,
        token: String,
        email: { type: String, trim: true }
    },
    createdAt: { type: Number, default: Date.now() },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null }
})

UserSchema.statics = {
    createNew(item){
        return this.create(item)
    },
    findByFacebookUid(uid){
        return this.findOne({ 'facebook.uid': uid })
    },
    findByGoogleUid(uid){
        return this.findOne({ 'google.uid': uid })
    },
    findByEmail(email){
        return this.findOne({ 'local.email': email })
    },
    findByToken(token){
        return this.findOne({ 'local.verifyToken': token })
    },
    findUserById(id){
        return this.findById(id)
    },
    removeById(id){
        return this.findOneAndDelete(id)
    },
    updateUser(id, item){
        return this.findByIdAndUpdate(id, item)
    },
    updatePassword(id, hashedPassword){
        return this.findByIdAndUpdate(id, {
			$set: { 'local.password': hashedPassword }
		})
    },
    verify(token){
        return this.findOneAndUpdate(
            { 'local.verifyToken': token },
            { $set: { 'local.isActive': true, 'local.verifyToken': null } }
        )
    },
    findAllUserForAddContact(deprecatedUserId, keyword){
        return this.find({
            $and: [
                { '_id': { $nin: deprecatedUserId }},
                { 'local.isActive': true },
                { $or: [
                    { 'username': 		{ $regex: keyword } },
                    { 'local.email': 	{ $regex: keyword } },
                    { 'google.email': 	{ $regex: keyword } },
                    { 'facebook.email': { $regex: keyword } }
                ]}
            ]
        }, { _id: 1, username: 1, address: 1, avatar: 1 })
    }
}

UserSchema.methods = {
    comparePassword(password){
        return bcrypt.compare(password, this.local.password)
    }
}

module.exports = mongoose.model('User', UserSchema)
