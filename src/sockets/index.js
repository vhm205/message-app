import addNewContact from './contacts/addNewContact';
import removeRequestContact from './contacts/removeRequestContact';
import removeRequestContactReceived from './contacts/removeRequestContactReceived';
import acceptRequestContactReceived from './contacts/acceptRequestContactReceived';
import removeContact from './contacts/removeContact';
import typingMessage from './chat/typingMessage';
import chatText from './chat/chatText';
import chatImage from './chat/chatImage';

const initSockets = io => {
	addNewContact(io)
	removeRequestContact(io)
	removeRequestContactReceived(io)
	acceptRequestContactReceived(io)
	removeContact(io)
	typingMessage(io)
	chatText(io)
	chatImage(io)
}

module.exports = initSockets;
