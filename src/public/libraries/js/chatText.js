function chatText(chatId) {
	$('.emojionearea').off('keyup').on('keyup', function(e) {
		if(e.which === 13){
			const inputChat = $(`.write-chat[data-chat="${chatId}"]`)
			const text = inputChat.val()

			if(!text || !inputChat) return;

			const dataSendMessage = {
				receiverId: chatId,
				text: text,
				isChatGroup: inputChat.hasClass('input-chat-group') ? true : false
			}

			$.post("/message/add-new-message", dataSendMessage, function (data) {
				console.log(data.message);
			}).fail(err => alertify.notify(err.responseJSON[0], 'error', 5))
		}
	})
}
