import {
	pushSocketIdToArray,
	removeSocketIdToArray,
	emitNotifyToArray
} from '../../helpers/socketHelpers';

const chatText = io => {
	let clients = {}

	io.on('connection', socket => {
		const { _id, chatGroupIds } = socket.request.user
		let groupID = null
		clients = pushSocketIdToArray(clients, _id, socket)
		// Add Group id into socket
		chatGroupIds.map(groupId => clients = pushSocketIdToArray(clients, groupId._id, socket))

		socket.on('push-id-to-socket', data => {
			groupID = data.id
			clients = pushSocketIdToArray(clients, data.id, socket)
		})

		socket.on('add-new-message', data => {
			const { conversationType, receiverId } = data.message

			const response = {
				conversationType: conversationType === 'group' ? 'group' : 'personal',
				message: data.message
			}

			// Check client is online, then send response
			if (clients[receiverId]) {
				emitNotifyToArray(clients, io, receiverId, 'response-add-new-message', response)
			}
		})

		socket.on('disconnect', () => {
			clients = removeSocketIdToArray(clients, _id, socket)
			// Remove Group id in socket
			chatGroupIds.map(groupId => clients = removeSocketIdToArray(clients, groupId._id, socket))
			if (groupID) {
				clients = removeSocketIdToArray(clients, groupID, socket)
			}
		})
	})
}

module.exports = chatText;
