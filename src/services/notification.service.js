import { contents, notifyModel } from '../models/notification.model';
import UserModel from '../models/user.model';

const getNotifications = (userId, limit = 10) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get all notify and limit 10
			const notifications = await notifyModel.getByUserIdAndLimit(userId, limit)
			// Find user by sender id and get info of sender
			const getNotifyContents = notifications.map(async notify => {
				let sender = await UserModel.findUserById(notify.senderId)
				return contents.getContent(notify.type, notify.isReaded, sender._id, sender.username, sender.avatar)
			})
			
			resolve(await Promise.all(getNotifyContents));
		} catch (err) {
			reject(err)
		}
	})
}

module.exports = {
	getNotifications
}