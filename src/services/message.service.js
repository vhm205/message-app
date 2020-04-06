import UserModel from '../models/user.model';
import ContactModel from '../models/contact.model';
import ChatGroupModel from '../models/chatGroup.model';
import { messageModel, conversationType, messageType } from '../models/message.model';
import { transErrors } from '../../lang/vi';
import { app } from '../config/app';

const LIMIT_CONVERSATION_TAKEN = 10;
const LIMIT_MESSAGE_TAKEN = 15;

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
			// allConversations.sort((a, b) => b.updatedAt - a.updatedAt)

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

			resolve(allConversationWithMess)
		} catch (err) {
			console.error(err);
			return reject(err)
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

module.exports = {
	getAllConversations,
	addNewMessage
}
