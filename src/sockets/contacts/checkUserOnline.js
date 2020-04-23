import { 
	pushSocketIdToArray,
	removeSocketIdToArray
} from '../../helpers/socketHelpers';

const checkUserOnline = io => {
	let clients = {}

	io.on('connection', socket => {
		const currentUserId = socket.request.user._id
		clients = pushSocketIdToArray(clients, currentUserId, socket)
		
		socket.on('check-online', data => {
			const listUserOnline = data.listUsersId.filter(userId => clients[userId])
			socket.emit('response-check-online', { listUser: listUserOnline })
			socket.broadcast.emit('response-check-online', { listUser: [currentUserId] })
		})

		socket.on('disconnect', () => {
			socket.broadcast.emit('response-check-offline', { currentUserId })
			clients = removeSocketIdToArray(clients, currentUserId, socket)
		})
	})
}

module.exports = checkUserOnline;
