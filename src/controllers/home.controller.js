import { notify, contact } from '../services/index';

const getHome = async (req, res) => {
	const { _id } = req.user

	// Get 10 notify one time
	const getNotify = await notify.getNotifications(_id)

	// Get amount notifications unread
	const countNotifyUnread = await notify.getNotifyUnRead(_id)

	// Get contacts (limit 10)
	const getContacts = await contact.getContacts(_id)

	// Get contacts send (limit 10)
	const getContactsSent = await contact.getContactsSent(_id)

	// Get contacts received (limit 10)
	const getContactsReceived = await contact.getContactsReceived(_id)

	// Count notification in contact modal
	const countAllContacts = await contact.countAllContacts(_id)
	const countAllContactsSend = await contact.countAllContactsSend(_id)
	const countAllContactsReceived = await contact.countAllContactsReceived(_id)

    res.render('main/home/home', {
        errors: req.flash('errors'),
        success: req.flash('success'),
		notifyUnread: countNotifyUnread,
		notifications: getNotify,
		contacts: getContacts,
		contactsSent: getContactsSent,
		contactsReceived: getContactsReceived,
		countAllContacts: countAllContacts,
		countAllContactsSend: countAllContactsSend,
		countAllContactsReceived: countAllContactsReceived,
		totalContactSendAndReceived: countAllContactsSend + countAllContactsReceived,
		user: req.user
    })
}

module.exports = { getHome }
