import { notify } from '../services/index';

const getHome = async (req, res) => {
	const getNotify = await notify.getNotifications(req.user._id)

    res.render('main/home/home', {
        errors: req.flash('errors'),
        success: req.flash('success'),
		notifications: getNotify,
		user: req.user
    })
}

module.exports = { getHome }
