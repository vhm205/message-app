import {
	pushSocketIdToArray,
	removeSocketIdToArray,
	emitNotifyToArray
} from '../../helpers/socketHelpers';

const addNewGroupChat = io => {
	let clients = {};

	io.on('connection', socket => {
		const { _id, username, avatar } = socket.request.user;
		clients = pushSocketIdToArray(clients, _id, socket);

		socket.on('create-new-group-chat', data => {
			const { members } = data.data;
			data.data.sender = username;
			data.data.avatar = avatar;

			// Check client is online, then send response
			for (const obj of members) {
				if (clients[obj._id] && obj._id !== _id.toString()) {
					emitNotifyToArray(clients, io, obj._id, 'response-create-new-group-chat', data.data);
				}
			}
		})

		socket.on('disconnect', () => {
			clients = removeSocketIdToArray(clients, _id, socket);
		})
	})
}

module.exports = addNewGroupChat;
