import ContactModel from '../models/contact.model';
import UserModel from '../models/user.model';
import ChatGroupModel from '../models/chatGroup.model';

const LIMIT_CONVERSATION_TAKEN = 10

const getAllConversations = userId => {
	return new Promise(async (resolve, reject) => {
		try {
			const contacts = await ContactModel.getContacts(userId, LIMIT_CONVERSATION_TAKEN)
			const userConversationsPromise = contacts.map(async contact => {
				let userInfo = (contact.contactId == userId) ? 
				await UserModel.findNormalUserById(contact.userId) : 
				await UserModel.findNormalUserById(contact.contactId)

				// Assign updatedAt field of contact into userInfo
				userInfo.updatedAt = contact.updatedAt
				return userInfo;
			})

			// Get contact of current user
			const userConversations = await Promise.all(userConversationsPromise)

			// Get all groups with current user
			const groupConversations = await ChatGroupModel.getChatGroup(userId, LIMIT_CONVERSATION_TAKEN)

			// Merge two arrays above into one
			const allConversations = [...userConversations, ...groupConversations]

			// Sort it! DESCENDING by updatedAt
			allConversations.sort((a, b) => b.updatedAt - a.updatedAt)

			resolve({
				userConversations,
				groupConversations,
				allConversations
			})
		} catch (error) {
			console.error(err);
			reject(err)
		}
	})
}

module.exports = {
	getAllConversations
}
