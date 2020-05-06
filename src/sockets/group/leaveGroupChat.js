import {
	pushSocketIdToArray,
	removeSocketIdToArray,
	emitNotifyToArray
} from '../../helpers/socketHelpers';

const leaveGroupChat = io => {
	let clients = {};

	io.on('connection', socket => {
		const { _id, chatGroupIds } = socket.request.user;
		let groupID = null;
		clients = pushSocketIdToArray(clients, _id, socket);
		chatGroupIds.map(groupId => clients = pushSocketIdToArray(clients, groupId._id, socket));

		socket.on('push-id-to-socket', data => {
			groupID = data.id;
			clients = pushSocketIdToArray(clients, data.id, socket);
		})

		socket.on('user-leave-group', data => {
			// Assign current user id for data
			data.userId = _id;
			// Check client is online, then send response
			data.listMemberId.map(id => {
				if (clients[id]) {
					emitNotifyToArray(clients, io, id, 'response-user-leave-group', data);
				}
			})
		})

		socket.on('disconnect', () => {
			if (groupID) clients = removeSocketIdToArray(clients, groupID, socket);
			clients = removeSocketIdToArray(clients, _id, socket);
			chatGroupIds.map(groupId => clients = removeSocketIdToArray(clients, groupId._id, socket));
		})
	})
}

module.exports = leaveGroupChat;
