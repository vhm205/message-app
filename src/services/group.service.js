import ChatGroupModel from '../models/chatGroup.model';
import ContactModel from '../models/contact.model';
import UserModel from '../models/user.model';
import { types, notifyModel } from '../models/notification.model';
import { transErrors } from '../../lang/vi';
import { LIMIT_CONVERSATION_TAKEN } from '../config/app';

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

		let newChatGroup = await ChatGroupModel.createNew(items);
		newChatGroup = newChatGroup.toObject();
		const infoMember = await Promise.all(newChatGroup.members.map(async member => {
			let user = await UserModel.findNormalUserById(member.userId);
			let isMadeFriend = await ContactModel.checkExists(userId, member.userId)
			// Check current user and member in the group is already made a friend 
			user = user.toObject();
			user.status = isMadeFriend ? isMadeFriend.status : false;
			return user;
		}))
		newChatGroup.members = infoMember;

		// Create notify in DB
		// members.map(async id => {
		// 	await notifyModel.createNew({
		// 		senderId: currendUserId,
		// 		receiverId: id,
		// 		type: types.ADD_GROUP
		// 	})
		// });
		
		resolve(newChatGroup);
	})
}

const leaveGroupChat = (userId, groupId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const group = await ChatGroupModel.checkUserInGroup(userId, groupId);
			if (!group) return reject(transErrors.user_not_in_group);

			// Remove userId in members[]
			const leaveGroupChat = await ChatGroupModel.leaveGroupChat(userId, groupId, group.userAmount - 1);
			return resolve(leaveGroupChat);
		} catch (err) {
			return reject(err);
		}
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
			// Get groups of current user (skip, limit)
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

const readMoreGroupRemainingWithMembers = (userId, skip, timestamp) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get groups of current user (skip, limit)
			const readMoreGroupOfCurrentUser = await ChatGroupModel.readMoreChatGroupRemaning(userId, skip, timestamp);

			// Assign info of members for group.members and return all group
			const readMoreGroupWithMemberPromise = readMoreGroupOfCurrentUser.map(async group => { 
				group = group.toObject();
				const members = await Promise.all(group.members.map(async member => {
					let user = await UserModel.findNormalUserById(member.userId);
					let isHaveFriends = await ContactModel.checkExists(userId, member.userId)
					// Check current user and member in the group is already made a friend 
					user = user.toObject();
					user.status = isHaveFriends ? isHaveFriends.status : false;
					return user;
				}))
				group.members = members;
				return group;
			})

			const readMoreGroupWithMember = await Promise.all(readMoreGroupWithMemberPromise);
			return resolve(readMoreGroupWithMember);
		} catch (err) {
			return reject(err);
		}
	})
}

module.exports = {
	findUsersContact,
	addNewChatGroup,
	leaveGroupChat,
	getAllGroupWithMembers,
	readMoreGroupRemainingWithMembers,
	readMoreGroupWithMembers
}
