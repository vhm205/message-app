import { notify } from '../services/index';

const readMoreNotif = async (req, res) => {
	try {
		// Get skip from query url
		const skipNumberNotif = +req.query.skip;

		// Get new notifications
		const newNotifications = await notify.readMoreNotif(req.user._id, skipNumberNotif)

		return res.status(200).send(newNotifications)
	} catch (err) {
		return res.status(500).send(err)
	}
}

const markAllAsRead = async (req, res) => {
	try {
		const mark = await notify.markAllAsRead(req.user._id, req.body.targetUsers)
		return res.status(200).send(mark)
	} catch (err) {
		return res.status(500).send(err)
	}
}

module.exports = {
	readMoreNotif,
	markAllAsRead
}
