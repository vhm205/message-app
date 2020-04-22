import addNewContact from './contacts/addNewContact';
import removeRequestContact from './contacts/removeRequestContact';
import removeRequestContactReceived from './contacts/removeRequestContactReceived';
import acceptRequestContactReceived from './contacts/acceptRequestContactReceived';
import removeContact from './contacts/removeContact';
import chatText from './chat/chatText';
import chatImage from './chat/chatImage';
import chatAttachment from './chat/chatAttachment';
import typingMessage from './chat/typingMessage';
import createGroupChat from './group/createGroupChat';

const initSockets = io => {
	addNewContact(io)
	removeRequestContact(io)
	removeRequestContactReceived(io)
	acceptRequestContactReceived(io)
	removeContact(io)
	typingMessage(io)
	chatText(io)
	chatImage(io)
	chatAttachment(io)
	createGroupChat(io)
}

module.exports = initSockets;
