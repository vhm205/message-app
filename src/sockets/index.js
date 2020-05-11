import addNewContact from './contacts/addNewContact';
import removeRequestContact from './contacts/removeRequestContact';
import removeRequestContactReceived from './contacts/removeRequestContactReceived';
import acceptRequestContactReceived from './contacts/acceptRequestContactReceived';
import removeContact from './contacts/removeContact';
import checkUserOnline from './contacts/checkUserOnline';
import callVideo from './chat/callVideo';
import chatText from './chat/chatText';
import chatImage from './chat/chatImage';
import chatAttachment from './chat/chatAttachment';
import typingMessage from './chat/typingMessage';
import createGroupChat from './group/createGroupChat';
import leaveGroupChat from './group/leaveGroupChat';

const initSockets = io => {
	require('events').EventEmitter.defaultMaxListeners = 20
	addNewContact(io)
	removeRequestContact(io)
	removeRequestContactReceived(io)
	acceptRequestContactReceived(io)
	removeContact(io)
	typingMessage(io)
	callVideo(io)
	chatText(io)
	chatImage(io)
	chatAttachment(io)
	createGroupChat(io)
	checkUserOnline(io)
	leaveGroupChat(io)
	// io.sockets.setMaxListeners(20);
	// io.sockets.getMaxListeners()
}

module.exports = initSockets;
