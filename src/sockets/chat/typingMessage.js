import { 
	pushSocketIdToArray, 
	removeSocketIdToArray, 
	emitNotifyToArray 
} from '../../helpers/socketHelpers';

const typingMessage = io => {
	let clients = {}
	
	io.on('connection', socket => {
		const { _id, chatGroupIds } = socket.request.user
		clients = pushSocketIdToArray(clients, _id, socket)
		// Add Group id into socket
		chatGroupIds.map(groupId => clients = pushSocketIdToArray(clients, groupId._id, socket))

		socket.on('user-typing', data => {
			const receiverId = data.receiverId
			
			// Check client is online, then send response
			if(clients[receiverId]){
				emitNotifyToArray(clients, io, receiverId, 'response-user-typing', { receiverId, senderId: _id })
			}
		})

		socket.on('user-not-typing', data => {
			const receiverId = data.receiverId
			
			// Check client is online, then send response
			if(clients[receiverId]){
				emitNotifyToArray(clients, io, receiverId, 'response-user-not-typing', { receiverId, senderId: _id })
			}
		})

		socket.on('disconnect', () => {
			clients = removeSocketIdToArray(clients, _id, socket)
			// Remove Group id in socket
			chatGroupIds.map(groupId => clients = removeSocketIdToArray(clients, groupId._id, socket))
		})
	})
}

module.exports = typingMessage;
