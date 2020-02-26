import { notify } from '../services/index';

const getHome = async (req, res) => {
	// Get 10 notify one time
	const getNotify = await notify.getNotifications(req.user._id)
	// Get amount notifications unread
	const countNotifyUnread = await notify.getNotifyUnRead(req.user._id)

    res.render('main/home/home', {
        errors: req.flash('errors'),
        success: req.flash('success'),
		notifyUnread: countNotifyUnread,
		notifications: getNotify,
		user: req.user
    })
}

module.exports = { getHome }
