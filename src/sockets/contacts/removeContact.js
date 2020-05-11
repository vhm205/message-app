import { 
	pushSocketIdToArray, 
	removeSocketIdToArray, 
	emitNotifyToArray 
} from '../../helpers/socketHelpers';

const removeContact = io => {
	let clients = {}
	
    io.on('connection', socket => {
		const currentUserId = socket.request.user._id
		clients = pushSocketIdToArray(clients, currentUserId, socket)

        socket.on('remove-contact', data => {
			const responseInfo = { id: currentUserId }

			// Check client is online, then send response
			if(clients[data.contactId]){
				emitNotifyToArray(clients, io, data.contactId, 'response-remove-contact', responseInfo)
			}
		})

		socket.on('disconnect', () => {
			clients = removeSocketIdToArray(clients, currentUserId, socket)
		})
	})
}

module.exports = removeContact;
