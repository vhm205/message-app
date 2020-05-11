function typingOn(chatId) {
	socket.emit('user-typing', { receiverId: chatId })
}
function typingOff(chatId) {
	socket.emit('user-not-typing', { receiverId: chatId })
}

socket.on('response-user-typing', response => {
	const { receiverId, senderId } = response;
	const currentUserId = $('#dropdown-navbar-user').data('uid');
	const isGroupChat = $(`.write-chat[data-chat="${receiverId}"]`).hasClass('input-chat-group');
	const chatId = isGroupChat ? receiverId : senderId;

	const htmlMessageTyping = `
		<div class="bubble you bubble-typing-gif"> 
			<img src="./libraries/images/chat/typing.gif" />
		</div>
	`;
	$(`.chat[data-chat=${chatId}]`).find('.bubble-typing-gif').remove()

	if (isGroupChat) {
		if (senderId !== currentUserId) {
			$(`.chat[data-chat=${chatId}]`).append(htmlMessageTyping);
		}
	} else {
		$(`.chat[data-chat=${chatId}]`).append(htmlMessageTyping);
	}

	nineScrollRight(chatId);
})

socket.on('response-user-not-typing', response => {
	const { receiverId, senderId } = response;
	const isGroupChat = $(`.write-chat[data-chat="${receiverId}"]`).hasClass('input-chat-group');
	const chatId = isGroupChat ? receiverId : senderId;
	const currentUserId = $('#dropdown-navbar-user').data('uid');

	if (isGroupChat) {
		if (senderId !== currentUserId) {
			$(`.chat[data-chat=${chatId}]`).find('.bubble-typing-gif').remove()
		}
	} else {
		$(`.chat[data-chat=${chatId}]`).find('.bubble-typing-gif').remove()
	}

	nineScrollRight(chatId);
})
