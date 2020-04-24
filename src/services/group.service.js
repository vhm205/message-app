import ChatGroupModel from '../models/chatGroup.model';
import ContactModel from '../models/contact.model';
import UserModel from '../models/user.model';
import { types, notifyModel } from '../models/notification.model';
import { transErrors } from '../../lang/vi';

const LIMIT_CONVERSATION_TAKEN = 10;

const findUsersContact = (userId, keyword) => {
	return new Promise(async resolve => {
		let listUserId = []
		let contactsByUser = await ContactModel.findContactsHaveBeenFriends(userId)

		// Add user has made friends
		contactsByUser.forEach(contact => {
			listUserId = [...listUserId, contact.userId, contact.contactId]
		})
		listUserId = [...new Set(listUserId)].filter(id => id != userId)

		// Find All User, who has already made friends
		resolve(await UserModel.findAllUserForAddGroupChat(listUserId, keyword))
	})
}

const addNewChatGroup = (userId, name, amount, members) => {
	return new Promise(async (resolve, reject) => {
		const checkExists = await ChatGroupModel.checkExists(userId, name)
		if (checkExists) return reject(transErrors.chatgroup_exists)

		// Convert variable
		const amountMember = +amount
		const currendUserId = userId.toString()

		const items = {
			name: name,
			userAmount: amountMember + 1,
			userId: currendUserId,
			members: [{ userId: currendUserId }, ...members.map(id => ({ userId: id }))]
		}

		// Create notify in DB
		members.map(async id => {
			await notifyModel.createNew({
				senderId: currendUserId,
				receiverId: id,
				type: types.ADD_GROUP
			})
		})

		resolve(await ChatGroupModel.createNew(items))
	})
}

const getAllGroupWithMembers = userId => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get all groups of current user
			const allGroupOfCurrentUser = await ChatGroupModel.getChatGroup(userId, LIMIT_CONVERSATION_TAKEN);

			// Assign info of members for group.members and return all group
			const allMemberInGroupPromise = allGroupOfCurrentUser.map(async group => { 
				group = group.toObject();
				const members = await Promise.all(group.members.map(async member => {
					const user = UserModel.findNormalUserById(member.userId);
					return await user;
				}))
				group.members = members;
				return group;
			})

			resolve(await Promise.all(allMemberInGroupPromise));
		} catch (err) {
			return reject(err);
		}
	})
}

module.exports = {
	findUsersContact,
	addNewChatGroup,
	getAllGroupWithMembers
}
