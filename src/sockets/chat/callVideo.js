import {
	pushSocketIdToArray,
	removeSocketIdToArray,
	emitNotifyToArray
} from '../../helpers/socketHelpers';

const callVideo = io => {
    let clients = {};

	io.on('connection', socket => {
        const { _id } = socket.request.user;
		clients = pushSocketIdToArray(clients, _id, socket);

		socket.on('check-listener-online-offline', data => {
            const { callerName, listenerId } = data;

			// Check client is online, then send response
			if (clients[listenerId]) {
                const response = {
                    callerId: _id,
                    listenerId: listenerId,
                    callerName
                };
				emitNotifyToArray(clients, io, listenerId, 'response-peer-id-listener', response);
			} else{
                socket.emit('listener-is-offline');
            }
        })
        
        socket.on('listener-emit-peer-id', data => {
            const { listenerId, callerId, callerName, listenerName, listenerPeerId } = data;
            
            // Check client is online, then send response
            if (clients[callerId]) {
                const response = {
                    listenerId, 
                    callerId, 
                    callerName,
                    listenerName,
                    listenerPeerId
                };
				emitNotifyToArray(clients, io, callerId, 'response-peer-id-listener-to-caller', response);
			}
        })

        socket.on('caller-request-call-video', data => {
            const { listenerId, callerId, callerName, listenerName, listenerPeerId } = data;
            
            // Check client is online, then send response
            if (clients[listenerId]) {
                const response = {
                    listenerId, 
                    callerId, 
                    callerName,
                    listenerName,
                    listenerPeerId
                };
				emitNotifyToArray(clients, io, listenerId, 'response-request-call-to-listener', response);
			}
        })

        socket.on('caller-cancel-call-video', data => {
            const { listenerId, callerId, callerName, listenerName, listenerPeerId } = data;
            
            // Check client is online, then send response
            if (clients[listenerId]) {
                const response = {
                    listenerId, 
                    callerId, 
                    callerName,
                    listenerName,
                    listenerPeerId
                };
				emitNotifyToArray(clients, io, listenerId, 'response-cancel-call-to-listener', response);
			}
        })

        socket.on('listener-reject-call-video', data => {
            const { listenerId, callerId, callerName, listenerName, listenerPeerId } = data;
            
            // Check client is online, then send response
            if (clients[callerId]) {
                const response = {
                    listenerId, 
                    callerId, 
                    callerName,
                    listenerName,
                    listenerPeerId
                };
				emitNotifyToArray(clients, io, callerId, 'response-reject-call-to-caller', response);
			}
        })

        socket.on('listener-accept-call-video', data => {
            const { listenerId, callerId, callerName, listenerName, listenerPeerId } = data;

            const response = {
                listenerId, 
                callerId, 
                callerName,
                listenerName,
                listenerPeerId
            };
            
            // Check client is online, then send response
            if (clients[callerId]) {
				emitNotifyToArray(clients, io, callerId, 'response-accept-call-to-caller', response);
            }
            if (clients[listenerId]) {
				emitNotifyToArray(clients, io, listenerId, 'response-accept-call-to-listener', response);
			}
        })

        socket.on('caller-end-call-video', data => {
            if(clients[data.listenerId]){
                emitNotifyToArray(clients, io, data.listenerId, 'response-listener-end-call-video', data);
            }
        })

        socket.on('listener-end-call-video', data => {
            if(clients[data.callerId]){
                emitNotifyToArray(clients, io, data.callerId, 'response-caller-end-call-video', data);
            }
        })

		socket.on('disconnect', () => {
			clients = removeSocketIdToArray(clients, _id, socket);
		})
	})
}

module.exports = callVideo;
