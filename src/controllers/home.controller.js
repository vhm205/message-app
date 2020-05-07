import { notify, contact, message, group } from '../services/index';
import { 
	bufferToBase64, 
	getLastIndex, 
	convertTimstampToHumanTime 
} from '../helpers/clientHelpers';

const getHome = async (req, res) => {
	const { _id } = req.user

	// Get 10 notify one time
	const getNotif = await notify.getNotifications(_id)

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

	// Get All Conversation of current user
	const allConversationWithMess = await message.getAllConversations(_id)

	// Get All Group with members
	const allGroupWithMembers = await group.getAllGroupWithMembers(_id)	

	res.render('main/home/home', {
		errors: req.flash('errors'),
		success: req.flash('success'),
		notifyUnread: countNotifyUnread,
		notifications: getNotif,
		allConversationWithMess,
		allGroupWithMembers,
		contacts: getContacts,
		contactsSent: getContactsSent,
		contactsReceived: getContactsReceived,
		countAllContacts: countAllContacts,
		countAllContactsSend: countAllContactsSend,
		countAllContactsReceived: countAllContactsReceived,
		totalContactSendAndReceived: countAllContactsSend + countAllContactsReceived,
		convertTimstampToHumanTime,
		bufferToBase64: bufferToBase64,
		getLastIndex: getLastIndex,
		user: req.user
	})
}

module.exports = { getHome }
