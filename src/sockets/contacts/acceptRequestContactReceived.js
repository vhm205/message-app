import { 
	pushSocketIdToArray, 
	removeSocketIdToArray, 
	emitNotifyToArray 
} from '../../helpers/socketHelpers';

const acceptRequestContactReceived = io => {
	let clients = {}
	
    io.on('connection', socket => {
		const currentUserId = socket.request.user._id
		clients = pushSocketIdToArray(clients, currentUserId, socket)

        socket.on('accept-request-contact-received', data => {
			const responseInfo = {
				id: socket.request.user._id,
				username: socket.request.user.username,
				avatar: socket.request.user.avatar,
				address: socket.request.user.address
			}

			// Check client is online, then send response
			if(clients[data.contactId]){
				emitNotifyToArray(clients, io, data.contactId, 'response-accept-request-contact-received', responseInfo)
			}
		})

		socket.on('disconnect', () => {
			clients = removeSocketIdToArray(clients, currentUserId, socket)
		})
	})
}

module.exports = acceptRequestContactReceived;
