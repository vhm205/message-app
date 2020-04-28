import ChatGroupModel from '../models/chatGroup.model';
import ContactModel from '../models/contact.model';
import UserModel from '../models/user.model';
import { types, notifyModel } from '../models/notification.model';
import { transErrors } from '../../lang/vi';

const LIMIT_CONVERSATION_TAKEN = 1;

const findUsersContact = (userId, keyword) => {
	return new Promise(async resolve => {
		let listUserId = [];
		let contactsByUser = await ContactModel.findContactsHaveBeenFriends(userId);

		// Add user id has made friends
		contactsByUser.forEach(contact => {
			listUserId = [...listUserId, contact.userId, contact.contactId]
		});
		listUserId = [...new Set(listUserId)].filter(id => id != userId);

		// Find All User, who has already made friends
		resolve(await UserModel.findAllUserInListId(listUserId, keyword));
	})
}

const addNewChatGroup = (userId, name, amount, members) => {
	return new Promise(async (resolve, reject) => {
		const checkExists = await ChatGroupModel.checkExists(userId, name);
		if (checkExists) return reject(transErrors.chatgroup_exists);

		// Convert variable
		const amountMember = +amount;
		const currendUserId = userId.toString();

		const items = {
			name: name,
			userAmount: amountMember + 1,
			userId: currendUserId,
			members: [{ userId: currendUserId }, ...members.map(id => ({ userId: id }))]
		};

		// Create notify in DB
		members.map(async id => {
			await notifyModel.createNew({
				senderId: currendUserId,
				receiverId: id,
				type: types.ADD_GROUP
			})
		});

		resolve(await ChatGroupModel.createNew(items));
	})
}

const getAllGroupWithMembers = userId => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get groups of current user (limit)
			const allGroupOfCurrentUser = await ChatGroupModel.getChatGroup(userId, LIMIT_CONVERSATION_TAKEN);

			// Assign info of members for group.members and return all group
			const allMemberInGroupPromise = allGroupOfCurrentUser.map(async group => { 
				group = group.toObject();
				const members = await Promise.all(group.members.map(async member => {
					let user = await UserModel.findNormalUserById(member.userId);
					let isMadeFriend = await ContactModel.checkExists(userId, member.userId)
					// Check current user and member in the group is already made a friend 
					user = user.toObject();
					user.status = isMadeFriend ? isMadeFriend.status : false;
					return user;
				}))
				group.members = members;
				return group;
			})

			const allMemberInGroup = await Promise.all(allMemberInGroupPromise);
			return resolve(allMemberInGroup);
		} catch (err) {
			return reject(err);
		}
	})
}

const readMoreGroupWithMembers = (userId, skip) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get groups of current user (limit)
			const allGroupOfCurrentUser = await ChatGroupModel.readMoreChatGroup(userId, skip, LIMIT_CONVERSATION_TAKEN);

			// Assign info of members for group.members and return all group
			const allMemberInGroupPromise = allGroupOfCurrentUser.map(async group => { 
				group = group.toObject();
				const members = await Promise.all(group.members.map(async member => {
					let user = await UserModel.findNormalUserById(member.userId);
					let isMadeFriend = await ContactModel.checkExists(userId, member.userId)
					// Check current user and member in the group is already made a friend 
					user = user.toObject();
					user.status = isMadeFriend ? isMadeFriend.status : false;
					return user;
				}))
				group.members = members;
				return group;
			})

			const allMemberInGroup = await Promise.all(allMemberInGroupPromise);
			return resolve(allMemberInGroup);
		} catch (err) {
			return reject(err);
		}
	})
}

module.exports = {
	findUsersContact,
	addNewChatGroup,
	getAllGroupWithMembers,
	readMoreGroupWithMembers
}
