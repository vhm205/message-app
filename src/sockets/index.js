import addNewContact from './contacts/addNewContact';
import removeRequestContact from './contacts/removeRequestContact';
import removeRequestContactReceived from './contacts/removeRequestContactReceived';
import acceptRequestContactReceived from './contacts/acceptRequestContactReceived';
import removeContact from './contacts/removeContact';
import checkUserOnline from './contacts/checkUserOnline';
import chatText from './chat/chatText';
import chatImage from './chat/chatImage';
import chatAttachment from './chat/chatAttachment';
import typingMessage from './chat/typingMessage';
import createGroupChat from './group/createGroupChat';

const initSockets = io => {
	io.sockets.setMaxListeners(20);
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
	checkUserOnline(io)
	// io.on('connection', socket => {
	// 	let clients = {}
	// 	const currentUserId = socket.request.user._id
	// 	clients = pushSocketIdToArray(clients, currentUserId, socket)

	// 	checkUserOnline(clients, socket, currentUserId)

	// 	socket.on('disconnect', () => {
	// 		socket.broadcast.emit('response-check-offline', { currentUserId })
	// 		clients = removeSocketIdToArray(clients, currentUserId, socket)
	// 	})
	// })
	// io.sockets.getMaxListeners()
}

module.exports = initSockets;
