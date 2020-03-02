import { contents, notifyModel } from '../models/notification.model';
import UserModel from '../models/user.model';

const LIMIT_NUMBER_TAKEN = 2

const getNotifContents = notifications => {
	// Find user by sender id and get info of sender
	const getContents = notifications.map(async notify => {
		let sender = await UserModel.findUserById(notify.senderId)
		return contents.getContent(notify.type, notify.isReaded, sender._id, sender.username, sender.avatar)
	})

	return Promise.all(getContents)
}

const getNotifications = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get all notify and limit
			const notifications = await notifyModel.getByUserIdAndLimit(userId, LIMIT_NUMBER_TAKEN)

			resolve(await getNotifContents(notifications));
		} catch (err) {
			reject(err)
		}
	})
}

const getNotifyUnRead = userId => {
	return new Promise(async (resolve, reject) => {
		try {
			// Count amount notifications unread
			resolve(await notifyModel.getNotifUnread(userId))
		} catch (err) {
			reject(err)
		}
	})
}

const readMoreNotif = (userId, skip) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get more notifications and limit (Skip old)
			const newNotifications = await notifyModel.readMoreNotif(userId, skip, LIMIT_NUMBER_TAKEN);
			
			resolve(await getNotifContents(newNotifications))
		} catch (err) {
			reject(err)
		}
	})
}

const markAllAsRead = (userId, targetUsers) => {
	return new Promise(async (resolve, reject) => {
		try {
			await notifyModel.markAllAsRead(userId, targetUsers)
			resolve(true)
		} catch (err) {
			console.error(err);
			reject(false)
		}
	})
}

module.exports = {
	getNotifications,
	getNotifyUnRead,
	readMoreNotif,
	markAllAsRead
}
