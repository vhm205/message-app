const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    type: String,
    isReaded: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now }
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
	},
	markAllAsRead(userId, targetUsers){
		return this.updateMany({
			$and: [
				{ 'receiverId': userId },
				{ 'senderId': { $in: targetUsers } }
			]
		}, { $set: { 'isReaded': true } })
	}
}

const NOTIFICATION_TYPES = {
	ADD_CONTACT : 'add_contact',
	ACCEPT_CONTACT : 'accept_contact',
	ADD_GROUP: 'add_group'
}

const NOTIFICATION_CONTENTS = {
	getContent: (notifyType, isReaded, userId, username, avatar) => {
		const readed = !isReaded ? "notify-readed-false" : "";

		if(notifyType === NOTIFICATION_TYPES.ADD_CONTACT){
			return `
				<div data-uid="${userId}" class="${readed}">
					<img class="avatar-small" src="./libraries/images/users/${avatar}" alt="Notification"> 
					<strong>${username}</strong> đã gửi cho bạn 1 lời mời kết bạn
				</div>`;
		}
		if(notifyType === NOTIFICATION_TYPES.ACCEPT_CONTACT){
			return `
				<div data-uid="${userId}" class="${readed}">
					<img class="avatar-small" src="./libraries/images/users/${avatar}" alt="Notification"> 
					<strong>${username}</strong> đã chấp nhận lời mời kết bạn
				</div>`;
		}
		if(notifyType === NOTIFICATION_TYPES.ADD_GROUP){
			return `
				<div data-uid="${userId}" class="${readed}">
					<img class="avatar-small" src="./libraries/images/users/${avatar}" alt="Notification"> 
					<strong>${username}</strong> đã thêm bạn vào một nhóm chat
				</div>`;
		}
		return "Doesn't match with any notify type";
	}
}

module.exports = {
	notifyModel: mongoose.model('Notification', NotificationSchema),
	types: NOTIFICATION_TYPES,
	contents: NOTIFICATION_CONTENTS
}
