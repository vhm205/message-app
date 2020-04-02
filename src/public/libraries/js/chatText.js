function chatText(chatId) {
	$('.emojionearea').off('keyup').on('keyup', function(e) {
		if(e.which === 13){
			const inputChat = $(`.write-chat[data-chat="${chatId}"]`)
			const text = inputChat.val()
			
			if(!text || !inputChat) return;

			const dataSendMessage = {
				uid: chatId,
				text: text,
				isChatGroup: inputChat.hasClass('input-chat-group') ? true : false
			}
			
			$.post("/message/add-new-message", dataSendMessage, function (data) {
				console.log(data);
				
			}).fail(err => console.error(err))
		}
	})
}