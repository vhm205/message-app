function callVideo(chatId) {
    $(`#video-chat-${chatId}`).off('click').on('click', function() {
        const callerName = $('#navbar-username').text().trim();
        const data = {
            callerName: callerName,
            listenerId: chatId
        };

        socket.emit('check-listener-online-offline', data);
    })
}

function playVideoStream(videoId, stream) {
    const video = document.getElementById(videoId);
    video.srcObject = stream;
    video.onloadeddata = function () {
        video.play();
    }
}

function closeVideoStream(stream) {
    return stream.getTracks().map(track => track.stop());
}

$(document).ready(function(){
    let peerId = "";
    const peer = new Peer({
        key: 'peerjs',
        host: 'peerjs-server-trungquandev.herokuapp.com',
        secure: true,
        port: 443,
        debug: 3
    });

    peer.on('open', function(id){
        peerId = id;
    })

    socket.on('listener-is-offline', () => {
        alertify.notify('Người dùng hiện đang offline', 'error', 3);
    })

    socket.on('response-peer-id-listener', response => {
        const { listenerId, callerId, callerName } = response;
        const listenerName = $('#navbar-username').text().trim();

        const data = {
            listenerId, 
            callerId, 
            callerName,
            listenerName,
            listenerPeerId: peerId
        }        
        socket.emit('listener-emit-peer-id', data);
    })

    socket.on('response-peer-id-listener-to-caller', response => {
        const { listenerId, callerId, callerName, listenerName, listenerPeerId } = response
        const data = {
            listenerId, 
            callerId, 
            callerName,
            listenerName,
            listenerPeerId
        };

        socket.emit('caller-request-call-video', data);

        let timerInterval;
        Swal.fire({
            title: `<h3><i class="fa fa-volume-control-phone">&nbsp;</i> Đang gọi cho <span style="color: #2ECC71">${listenerName}</span></h3>`,
            html:  `<h4>Thời gian: <b style="color: #D43F3A"></b></h4>
                <button id="btn-cancel-call" class="btn btn-danger">Hủy cuộc gọi</button>
            `,
            backdrop: 'rgba(85,85,85, .4)',
            allowOutsideClick: false,
            width: "52rem",
            timer: 30000,
            timerProgressBar: true,
            onBeforeOpen: () => {
                $('#btn-cancel-call').off('click').on('click', function(){
                    Swal.close();
                    socket.emit('caller-cancel-call-video', data);
                })
                Swal.showLoading();
                timerInterval = setInterval(() => {
                    Swal.getContent().querySelector('b').textContent = Math.ceil(Swal.getTimerLeft() / 1000) + "s";
                }, 1000)
            },
            onOpen: () => {
                socket.on('response-reject-call-to-caller', response => {
                    Swal.close();
                    Swal.fire({
                        title: `<h4><span style="color: #2ECC71">${response.callerName}</span> đã từ chối cuộc gọi</h4>`,
                        icon: 'info',
                        backdrop: 'rgba(85,85,85, .4)',
                        allowOutsideClick: false,
                        showCancelButton: false,
                        confirmButtonColor: '#2ECC71',
                        confirmButtonText: 'OK',
                    })
                });
            },
            onClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer');
            }
        })
    })

    socket.on('response-request-call-to-listener', response => {
        const { listenerId, callerId, callerName, listenerName, listenerPeerId } = response;
        const data = {
            listenerId, 
            callerId, 
            callerName,
            listenerName,
            listenerPeerId
        };

        let timerInterval;
        Swal.fire({
            title: `<h3><i class="fa fa-volume-control-phone">&nbsp;</i> <span style="color: #2ECC71">${callerName}</span> muốn trò chuyện video với bạn </h3>`,
            html:  `<h4>Thời gian: <b style="color: #D43F3A"></b></h4>
                <button id="btn-accept-call" class="btn btn-success">Đồng ý</button>
                <button id="btn-reject-call" class="btn btn-danger">Từ chối</button>
            `,
            backdrop: 'rgba(85,85,85, .4)',
            allowOutsideClick: false,
            width: "52rem",
            timer: 30000,
            timerProgressBar: true,
            onBeforeOpen: () => {
                $('#btn-reject-call').off('click').on('click', function(){
                    Swal.close();
                    socket.emit('listener-reject-call-video', data);
                })
                $('#btn-accept-call').off('click').on('click', function(){
                    Swal.close();
                    socket.emit('listener-accept-call-video', data);
                })
                Swal.showLoading();
                timerInterval = setInterval(() => {
                    Swal.getContent().querySelector('b').textContent = Math.ceil(Swal.getTimerLeft() / 1000) + "s";
                }, 1000)
            },
            onOpen: () => {
                socket.on('response-cancel-call-to-listener', response => {
                    Swal.close();
                });
            },
            onClose: () => {
                clearInterval(timerInterval);
            }
        })
    })

    socket.on('response-accept-call-to-caller', response => {
        Swal.close();

        const getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        console.log(getUserMedia);
        
        getUserMedia({video: true, audio: false}, function(stream) {
            $('#streamModal').modal('show');
            playVideoStream('local-stream', stream);

            const call = peer.call(response.listenerPeerId, stream);
            call.on('stream', function(remoteStream) {
                // Show stream in some video/canvas element.
                playVideoStream('remote-stream', remoteStream);
            });

            $('#streamModal').on('hidden.bs.modal', () => {
                closeVideoStream(stream);
            });
        }, function(err) {
            console.error('Failed to get local stream' ,err);
        });
    })

    socket.on('response-accept-call-to-listener', response => {
        Swal.close();

        const getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

        peer.on('call', function(call) {
            getUserMedia({video: true, audio: false}, function(stream) {
                $('#streamModal').modal('show');

                const call = peer.call(response.listenerPeerId, stream);
                playVideoStream('local-stream', stream);
                call.answer(stream); // Answer the call with an A/V stream.
                call.on('stream', function(remoteStream) {
                    // Show stream in some video/canvas element.
                    playVideoStream('remote-stream', remoteStream);
                });

                $('#streamModal').on('hidden.bs.modal', () => {
                    closeVideoStream(stream);
                });
            }, function(err) {
                console.error('Failed to get local stream' ,err);
            });
        });
    })
})
