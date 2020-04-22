function chatText(chatId) {
	$('.emojionearea').off('keyup').on('keyup', function(e) {
		if(e.which === 13){
			const inputChat = $(`.write-chat[data-chat="${chatId}"]`);
			const text = inputChat.val();

			if(!text || !inputChat) return;

			const dataSendMessage = {
				receiverId: chatId,
				text: text,
				isChatGroup: inputChat.hasClass('input-chat-group') ? true : false
			}

			$.post("/message/add-new-message", dataSendMessage, function (data) {
				const { _id, sender, text, createdAt } = data.message;

				const messageOfMe = $(`<div class="me bubble" data-mess-id="${_id}"></div>`);
				// Convert emoji unicode to image
				messageOfMe.text(text);
				const convertEmoji = emojione.toImage(messageOfMe.html());
				
				if(dataSendMessage.isChatGroup){
					// Add small avatar beside the message
					messageOfMe.html(`<img src="./libraries/images/users/${sender.avatar}" class="avatar-small" title="${sender.name}" /> ${convertEmoji}`);

					// Increase number message in group
					increaseNumberMessageGroup(chatId);
				} else{
					messageOfMe.html(convertEmoji);
				}
				
				// Append Message & Scroll
				$(`.right .chat[data-chat=${chatId}]`).append(messageOfMe);
				nineScrollRight(chatId);

				// Update time and message preview
				const userLeft = $(`.person[data-chat=${chatId}]`);
				userLeft.find('.time').text(moment(createdAt).locale('vi').startOf('seconds').fromNow());
				userLeft.find('.preview').text(emojione.toImage(messageOfMe.text()));
				
				// Move conversation to the top (event + .namespace)
				userLeft.on('moveTop.moveConversationToTop', function(){
					$(this).closest('ul').prepend($(this).parent());
					userLeft.off('moveTop.moveConversationToTop');
				})
				userLeft.trigger('moveTop.moveConversationToTop');

				// Handle realtime chat message 
				socket.emit('add-new-message', { message: data.message });

				// Remove typing image
				$(`.chat[data-chat=${chatId}]`).find('.bubble-typing-gif').remove();

				// Turn off typing
				typingOff(chatId);
			}).fail(err => alertify.notify(err.responseJSON[0], 'error', 5))
		}
	})
}

socket.on('response-add-new-message', response => {
	const { _id, sender, senderId, receiverId, text, createdAt } = response.message;
	const currentUserId = $('#dropdown-navbar-user').data('uid');
	const messageOfYou = $(`<div class="you bubble" data-mess-id="${_id}"></div>`);

	// Convert emoji unicode to image
	messageOfYou.text(text);
	const convertEmoji = emojione.toImage(messageOfYou.html());
	const isChatGroup = response.conversationType === 'group';
	const chatId = isChatGroup ? receiverId : senderId;
	
	if(isChatGroup){
		// Add small avatar beside the message
		messageOfYou.html(`<img src="./libraries/images/users/${sender.avatar}" class="avatar-small" title="${sender.name}" /> ${convertEmoji}`);

		// Increase number message in group
		if(senderId !== currentUserId) increaseNumberMessageGroup(chatId);
	} else{
		messageOfYou.html(convertEmoji);
	}

	// Update time and preview message
	const userLeft = $(`.person[data-chat=${chatId}]`);
	userLeft.find('.time').text(moment(createdAt).locale('vi').startOf('seconds').fromNow());
	userLeft.find('.preview').text(emojione.toImage(messageOfYou.text()));

	// If sender is not current user
	if(senderId !== currentUserId){
		// Append Message & Scroll
		$(`.right .chat[data-chat=${chatId}]`).append(messageOfYou);
		nineScrollRight(chatId);
		// Bold time text
		userLeft.find('.time, .preview').addClass('active');
	}

	// Move conversation to the top (event + .namespace)
	userLeft.on('moveTop.moveConversationToTop', function(){
		$(this).closest('ul').prepend($(this).parent());
		userLeft.off('moveTop.moveConversationToTop');
	})
	userLeft.trigger('moveTop.moveConversationToTop');
})
