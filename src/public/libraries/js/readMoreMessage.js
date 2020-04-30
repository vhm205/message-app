function readMoreMessage(chatId) {
	let lastMessage = false;
	$(`.right[data-chat=${chatId}] .chat`).off('scroll').on('scroll', function (e) {;
		if(e.target.scrollTop === 0 && !lastMessage){
			const chatContent = $(`.right[data-chat=${chatId}]`);
			const chat = $(`.right[data-chat=${chatId}] .chat`);
			const loader = chatContent.find('.content-chat .read-more-message');
			const firstCurrentMessage = $(chat.find('.bubble').first()).data('mess-id');
			const isChatGroup = chatContent.find('.write-chat').hasClass('input-chat-group');
			const skipMessage = chatContent.find('.bubble').length;
			loader.css('display', 'block');

			$.get(`/message/read-more-messages?chat_group=${isChatGroup}&chat_id=${chatId}&skip_message=${skipMessage}`, function(data) {					
				if(!data.length){
					lastMessage = true;
					return;
				}
				const currentUserId = $('#dropdown-navbar-user').data('uid');
				const messagesHtml  = rightSidePersonalMessages(data, currentUserId);

				chat.prepend(messagesHtml);
				const positionScroll = chat.find(`.bubble[data-mess-id=${firstCurrentMessage}]`)[0].offsetTop;
				chat.scrollTop(positionScroll + 50);
				
				// chatContent.find('.chat').getNiceScroll().resize();
			}).always(() => loader.css('display', 'none'));
		}
	})
}
