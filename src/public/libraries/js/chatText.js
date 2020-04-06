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

			// var text = html.replace(/<\/?[^>]+>/ig, " ");

			$.post("/message/add-new-message", dataSendMessage, function (data) {
				const { _id, sender, text, createdAt } = data.message;

				const messageOfMe = $(`<div class="me bubble" data-mess-id="${_id}"></div>`);
				messageOfMe.text(text);
				
				if(dataSendMessage.isChatGroup){
					// Add small avatar beside the message
					messageOfMe.prepend(`<img src="./libraries/images/users/${sender.avatar}" class="avatar-small" title="${sender.name}" />`);

					// Increase number message in group
					increaseNumberMessageGroup(chatId);
				}

				// Convert emoji unicode to image
				const convertEmoji = emojione.toImage(messageOfMe.html());
				messageOfMe.html(convertEmoji);
				
				// Append Message & Scroll
				$(`.right .chat[data-chat=${chatId}]`).append(messageOfMe);
				nineScrollRight(chatId);

				// Update time and message preview
				const userLeft = $(`.person[data-chat=${chatId}]`);
				userLeft.find('.time').text(moment(createdAt).locale('vi').startOf('seconds').fromNow());
				userLeft.find('.preview').text(emojione.toImage(messageOfMe.text()));
				
				// Move conversation to the top (click + .namespace)
				userLeft.on('click.moveConversationToTop', function(){
					$(this).closest('ul').prepend($(this).parent());
					userLeft.off('click.moveConversationToTop');
				})
				userLeft.trigger('click');

			}).fail(err => alertify.notify(err.responseJSON[0], 'error', 5))
		}
	})
}
