const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    type: String,
    isReaded: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() }
})

NotificationSchema.statics = {
	createNew(item){
		return this.create(item);
	},
	removeReqContactNotify(senderId, receiverId, type){
		return this.deleteOne({
			$and: [
				{ 'senderId': senderId },
				{ 'receiverId': receiverId },
				{ 'type': type }
			]
		})
	},
	getByUserIdAndLimit(userId, limit){
		return this.find({
			'receiverId': userId
		}).sort({ 'createdAt': -1 }).limit(limit)
	},
	getNotifUnread(userId){
		return this.countDocuments({
			$and: [
				{ 'receiverId': userId },
				{ 'isReaded': false }
			]
		})
	},
	readMoreNotif(userId, skip, limit){
		return this.find({
			'receiverId': userId
		}).sort({ 'createdAt': -1 }).skip(skip).limit(limit) 
	}
}

const NOTIFYCATION_TYPES = {
	ADD_CONTACT : 'add_contact'
}

const NOTIFICATION_CONTENTS = {
	getContent: (notifyType, isReaded, userId, username, avatar) => {
		if(notifyType === NOTIFYCATION_TYPES.ADD_CONTACT){
			return `<div data-uid="${userId}" class="${!isReaded ? "notify-readed-false" : ""}">
						<img class="avatar-small" src="./libraries/images/users/${avatar}" alt="avatar"> 
						<strong>${username}</strong> đã gửi cho bạn 1 lời mời kết bạn
					</div>`
		}
		return "Doesn't match with any notify type"
	}
}

module.exports = {
	notifyModel: mongoose.model('Notification', NotificationSchema),
	types: NOTIFYCATION_TYPES,
	contents: NOTIFICATION_CONTENTS
}
