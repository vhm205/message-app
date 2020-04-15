import { 
	pushSocketIdToArray, 
	removeSocketIdToArray, 
	emitNotifyToArray 
} from '../../helpers/socketHelpers';

const cancelRequestContact = io => {
	let clients = {}
	
    io.on('connection', socket => {
		const currentUserId = socket.request.user._id
		clients = pushSocketIdToArray(clients, currentUserId, socket)

        socket.on('remove-request-contact', data => {
			const responseInfo = { id: socket.request.user._id }

			// Check client is online, then send response
			if(clients[data.contactId]){
				emitNotifyToArray(clients, io, data.contactId, 'response-remove-request-contact', responseInfo)
			}
		})

		socket.on('disconnect', () => {
			clients = removeSocketIdToArray(clients, currentUserId, socket)
		})	
	})
}

module.exports = cancelRequestContact;
