const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: { type: String, min: 3 },
    gender: { type: String, default: "male" },
    phone: { type: Number, default: null },
    address: { type: String, default: null },
    avatar: { type: String, default: 'avatar-default.jpg' },
    role: { type: String, default: 'user' },
    local: {
        email: { type: String, trim: true },
        password: { type: String, min: 3 },
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
    verify(token){
        return this.findOneAndUpdate(
            { 'local.verifyToken': token },
            { $set: { 'local.isActive': true, 'local.verifyToken': null } }
        )
    }
}

UserSchema.methods = {
    comparePassword(password){
        return bcrypt.compare(password, this.local.password)
    }
}

module.exports = mongoose.model('User', UserSchema)
