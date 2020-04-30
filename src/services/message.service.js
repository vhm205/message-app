import UserModel from '../models/user.model';
import ContactModel from '../models/contact.model';
import ChatGroupModel from '../models/chatGroup.model';
import { messageModel, conversationType, messageType } from '../models/message.model';
import { transErrors } from '../../lang/vi';
import { app, LIMIT_CONVERSATION_TAKEN, LIMIT_MESSAGE_TAKEN } from '../config/app';

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

			// Get conversation with messages
			const allConversationsWithMessPromise = allConversations.map(async conversation => {
				conversation = conversation.toObject()
				let getMessages = conversation.members ? 
				await messageModel.getMessagesInGroup(conversation._id, LIMIT_MESSAGE_TAKEN) :
				await messageModel.getMessagesInPersonal(userId, conversation._id, LIMIT_MESSAGE_TAKEN);

				conversation.messages = getMessages.reverse();
				return conversation;
			})
			const allConversationWithMess = await Promise.all(allConversationsWithMessPromise)
			allConversationWithMess.sort((a, b) => b.updatedAt - a.updatedAt)

			return resolve(allConversationWithMess)
		} catch (err) {
			return reject(err)
		}
	})
}

const readMoreMessages = (userId, contactId, skipMessage, isChatGroup) => {
	return new Promise(async (resolve, reject) => {
		try {
			const readMoreMessages = isChatGroup === 'true' ? 
			await messageModel.readMoreMessagesInGroup(contactId, +skipMessage, LIMIT_MESSAGE_TAKEN) :
			await messageModel.readMoreMessagesInPersonal(userId, contactId, +skipMessage, LIMIT_MESSAGE_TAKEN);

			return resolve(readMoreMessages.reverse());
		} catch (err) {
			return reject(err);
		}
	})
}

const readMoreConversations = (userId, skipNumberGroup, skipNumberPerson) => {
	return new Promise(async (resolve, reject) => {
		try {
			const contacts = await ContactModel.readMoreContacts(userId, skipNumberPerson, LIMIT_CONVERSATION_TAKEN);			
			const userConversationsPromise = contacts.map(async contact => {
				let userInfo = (contact.contactId == userId) ? 
				await UserModel.findNormalUserById(contact.userId) : 
				await UserModel.findNormalUserById(contact.contactId);

				// Assign updatedAt field of contact into userInfo
				userInfo.updatedAt = contact.updatedAt;
				return userInfo;
			});

			// Get contact of current user
			const userConversations = await Promise.all(userConversationsPromise);

			// Read more groups with current user
			const groupConversations = await ChatGroupModel.readMoreChatGroup(userId, skipNumberGroup, LIMIT_CONVERSATION_TAKEN);

			// Merge two arrays above into one
			const readMoreConversations = [...userConversations, ...groupConversations];

			// Get conversation with messages
			const readMoreConversationsWithMessPromise = readMoreConversations.map(async conversation => {
				conversation = conversation.toObject();
				let getMessages = conversation.members ? 
				await messageModel.getMessagesInGroup(conversation._id, LIMIT_MESSAGE_TAKEN) :
				await messageModel.getMessagesInPersonal(userId, conversation._id, LIMIT_MESSAGE_TAKEN);

				conversation.messages = getMessages.reverse();
				return conversation;
			})
			const readMoreConversationWithMess = await Promise.all(readMoreConversationsWithMessPromise);
			readMoreConversationWithMess.sort((a, b) => b.updatedAt - a.updatedAt);
			
			return resolve(readMoreConversationWithMess);
		} catch (err) {
			return reject(err);
		}
	})
}

const getAllConversationsRemaining = (userId, contactId, skipNumberGroup, skipNumberPerson, group) => {
	return new Promise(async (resolve, reject) => {
		try {
			const contacts = await ContactModel.readMoreContactsRemaining(userId, skipNumberPerson);

			// Filter contacts by contact id
			let listContacts = [];
			let contactUpdatedAt = 0;
			for (const index in contacts) {
				listContacts = [...listContacts, contacts[index]];
				// if contact id is found in contacts, then break loop
				if(contacts[index].userId === contactId || contacts[index].contactId === contactId){
					contactUpdatedAt = contacts[index].updatedAt;
					break;
				}
			}

			const userConversationsPromise = listContacts.map(async contact => {
				let userInfo = (contact.contactId == userId) ? 
				await UserModel.findNormalUserById(contact.userId) : 
				await UserModel.findNormalUserById(contact.contactId);

				// Assign updatedAt field of contact into userInfo
				userInfo.updatedAt = contact.updatedAt;
				return userInfo;
			});

			// Get contact of current user
			const userConversations = await Promise.all(userConversationsPromise);

			// Read more groups with current user
			const groupConversations = await ChatGroupModel.readMoreChatGroupRemaning(userId, skipNumberGroup, contactUpdatedAt);
			// Read more groups with info of members for memberModal
			const moreGroupRemainingWithMembers = await group.readMoreGroupRemainingWithMembers(userId, skipNumberGroup, contactUpdatedAt);

			// Merge two arrays (userConversations, groupConversations) into one
			const readMoreConversationsRemaning = [...userConversations, ...groupConversations];

			// Get conversations with messages
			const readMoreConversationsWithMessPromise = readMoreConversationsRemaning.map(async conversation => {
				conversation = conversation.toObject();
				let getMessages = conversation.members ? 
				await messageModel.getMessagesInGroup(conversation._id, LIMIT_MESSAGE_TAKEN) :
				await messageModel.getMessagesInPersonal(userId, conversation._id, LIMIT_MESSAGE_TAKEN);

				conversation.messages = getMessages.reverse();
				return conversation;
			})
			const readMoreConversationWithMess = await Promise.all(readMoreConversationsWithMessPromise);
			readMoreConversationWithMess.sort((a, b) => b.updatedAt - a.updatedAt);

			return resolve({
				readMoreConversationWithMess,
				moreGroupRemainingWithMembers
			});
		} catch (err) {
			return reject(err);
		}
	})
}

// You can remove this func
const getConversationByContactId = (userId, contactId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const contact = await ContactModel.checkExists(userId, contactId);

			// Get info contact of current user
			let userInfo = (contact.contactId == userId) ? 
				await UserModel.findNormalUserById(contact.userId) : 
				await UserModel.findNormalUserById(contact.contactId);

			// Get conversation with messages
			userInfo = userInfo.toObject();
			const getMessages = await messageModel.getMessagesInPersonal(userId, userInfo._id, LIMIT_MESSAGE_TAKEN);
			userInfo.messages = getMessages.reverse();

			return resolve(userInfo);
		} catch (err) {
			return reject(err);
		}
	})
}

const addNewMessage = (sender, receiverId, text, isChatGroup) => {
	return new Promise(async (resolve, reject) => {
		try {
			if(isChatGroup === 'true'){
				// Check group chat is exists
				const getGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId)
				if(!getGroupReceiver) return reject(transErrors.group_not_found)

				const receiver = {
					id: getGroupReceiver._id,
					name: getGroupReceiver.name,
					avatar: app.avatar_group_chat
				}
				const messageItem = {
					senderId: sender.id,
					receiverId: receiver.id,
					messageType: messageType.TEXT,
					conversationType: conversationType.GROUP,
					sender: sender,
					receiver: receiver,
					text: text,
					createdAt: Date.now()
				}
				// Add new message to group chat
				const newMessage = await messageModel.createNew(messageItem)
				// Update Message Amount in Chat Group Model
				await ChatGroupModel.updateChatGroupById(receiverId, getGroupReceiver.messageAmount + 1)

				return resolve(newMessage)
			}

			// Check user receiver is exists
			const getUserReceiver = await UserModel.findNormalUserById(receiverId)
			if(!getUserReceiver) return reject(transErrors.personal_not_found)

			const receiver = {
				id: getUserReceiver._id,
				name: getUserReceiver.username,
				avatar: getUserReceiver.avatar
			}
			const messageItem = {
				senderId: sender.id,
				receiverId: receiver.id,
				messageType: messageType.TEXT,
				conversationType: conversationType.PERSONAL,
				sender: sender,
				receiver: receiver,
				text: text,
				createdAt: Date.now()
			}
			// Add new message
			const newMessage = await messageModel.createNew(messageItem);
			// Update Contact When has the new message
			await ContactModel.updateContactWhenHasMessage(sender.id, receiverId);

			return resolve(newMessage);
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	})
}

const addNewImage = (sender, receiverId, image, isChatGroup) => {
	return new Promise(async (resolve, reject) => {
		try {
			if(isChatGroup === 'true'){
				// Check group chat is exists
				const getGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId)
				if(!getGroupReceiver) return reject(transErrors.group_not_found)

				const receiver = {
					id: getGroupReceiver._id,
					name: getGroupReceiver.name,
					avatar: app.avatar_group_chat
				}
				const messageItem = {
					senderId: sender.id,
					receiverId: receiver.id,
					messageType: messageType.IMAGE,
					conversationType: conversationType.GROUP,
					sender: sender,
					receiver: receiver,
					file: {
						data: image.imageBuff,
						contentType: image.contentType,
						fileName: image.fileName
					},
					createdAt: Date.now()
				}
				// Add new message to group chat
				const newMessage = await messageModel.createNew(messageItem)
				// Update Message Amount in Chat Group Model
				await ChatGroupModel.updateChatGroupById(receiverId, getGroupReceiver.messageAmount + 1)

				return resolve(newMessage)
			}

			// Check user receiver is exists
			const getUserReceiver = await UserModel.findNormalUserById(receiverId)
			if(!getUserReceiver) return reject(transErrors.personal_not_found)

			const receiver = {
				id: getUserReceiver._id,
				name: getUserReceiver.username,
				avatar: getUserReceiver.avatar
			}
			const messageItem = {
				senderId: sender.id,
				receiverId: receiver.id,
				messageType: messageType.IMAGE,
				conversationType: conversationType.PERSONAL,
				sender: sender,
				receiver: receiver,
				file: {
					data: image.imageBuff,
					contentType: image.contentType,
					fileName: image.fileName
				},
				createdAt: Date.now()
			}
			// Add new message
			const newMessage = await messageModel.createNew(messageItem);
			// Update Contact When has the new message
			await ContactModel.updateContactWhenHasMessage(sender.id, receiverId);

			return resolve(newMessage);
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	})
}

const addNewAttachment = (sender, receiverId, attachment, isChatGroup) => {
	return new Promise(async (resolve, reject) => {
		try {
			if(isChatGroup === 'true'){
				// Check group chat is exists
				const getGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId)
				if(!getGroupReceiver) return reject(transErrors.group_not_found)

				const receiver = {
					id: getGroupReceiver._id,
					name: getGroupReceiver.name,
					avatar: app.avatar_group_chat
				}
				const messageItem = {
					senderId: sender.id,
					receiverId: receiver.id,
					messageType: messageType.FILE,
					conversationType: conversationType.GROUP,
					sender: sender,
					receiver: receiver,
					file: {
						data: attachment.attachmentBuff,
						contentType: attachment.contentType,
						fileName: attachment.fileName
					},
					createdAt: Date.now()
				}
				// Add new message to group chat
				const newMessage = await messageModel.createNew(messageItem)
				// Update Message Amount in Chat Group Model
				await ChatGroupModel.updateChatGroupById(receiverId, getGroupReceiver.messageAmount + 1)

				return resolve(newMessage)
			}

			// Check user receiver is exists
			const getUserReceiver = await UserModel.findNormalUserById(receiverId)
			if(!getUserReceiver) return reject(transErrors.personal_not_found)

			const receiver = {
				id: getUserReceiver._id,
				name: getUserReceiver.username,
				avatar: getUserReceiver.avatar
			}
			const messageItem = {
				senderId: sender.id,
				receiverId: receiver.id,
				messageType: messageType.FILE,
				conversationType: conversationType.PERSONAL,
				sender: sender,
				receiver: receiver,
				file: {
					data: attachment.attachmentBuff,
					contentType: attachment.contentType,
					fileName: attachment.fileName
				},
				createdAt: Date.now()
			}
			// Add new message
			const newMessage = await messageModel.createNew(messageItem);
			// Update Contact When has the new message
			await ContactModel.updateContactWhenHasMessage(sender.id, receiverId);

			return resolve(newMessage);
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	})
}

module.exports = {
	getAllConversationsRemaining,
	getAllConversations,
	readMoreConversations,
	readMoreMessages,
	addNewMessage,
	addNewAttachment,
	addNewImage
}
