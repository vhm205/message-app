import { 
	pushSocketIdToArray, 
	removeSocketIdToArray, 
	emitNotifyToArray 
} from '../../helpers/socketHelpers';

const addNewContact = io => {
	let clients = {}
	
    io.on('connection', socket => {
		const currentUserId = socket.request.user._id
		clients = pushSocketIdToArray(clients, currentUserId, socket)

        socket.on('request-add-contact', data => {
			const responseInfo = {
				id: socket.request.user._id,
				username: socket.request.user.username,
				avatar: socket.request.user.avatar,
				address: socket.request.user.address
			}

			// Check client is online, then send response
			if(clients[data.contactId]){
				emitNotifyToArray(clients, io, data.contactId, 'response-request-add-contact', responseInfo)
			}
		})

		socket.on('disconnect', () => {
			clients = removeSocketIdToArray(clients, currentUserId, socket)
		})
	})
}

module.exports = addNewContact;
