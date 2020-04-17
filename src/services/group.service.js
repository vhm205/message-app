import ChatGroupModel from '../models/chatGroup.model';
import ContactModel from '../models/contact.model';
import UserModel from '../models/user.model';

const findUsersContact = (userId, keyword) => {
	return new Promise(async resolve => {
		let listUserId = []
		let contactsByUser = await ContactModel.findAllByUser(userId)

		// Add user has made friends
		contactsByUser.forEach(contact => {
			listUserId = [...listUserId, contact.userId, contact.contactId]
		})
		listUserId = [...new Set(listUserId)].filter(id => id != userId)

		// Find All User, who has already made friends
		resolve(await UserModel.findAllUserForAddGroupChat(listUserId, keyword))
	})
}

const addNewChatGroup = (userId, name, amountMember, members) => {
	return new Promise(async (resolve, reject) => {
		
	})
}

module.exports = {
	findUsersContact,
	addNewChatGroup
}
