export const pushSocketIdToArray = (clients, userId, socket) => {
	// If client logged, then add socket.id
	// else create new client in clients array
	if(clients[userId]){
		clients[userId] = [...clients[userId], socket.id]
	} else{
		clients[userId] = [socket.id]
	}

	return clients
}

export const emitNotifyToArray = (clients, io, id, event, data) => {
	clients[id].map(socketId => {
		io.sockets.connected[socketId].emit(event, data)
	})
}

export const removeSocketIdToArray = (clients, userId, socket) => {
	// Remove old socketId 
	clients[userId] = clients[userId].filter(socketId => socketId !== socket.id)

	// If client logout all, then delete client
	!clients[userId].length && delete clients[userId]

	return clients
}
