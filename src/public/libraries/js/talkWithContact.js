function talkWithContact() {
	$('.user-talk').off('click').on('click', function() {
		const chatId = $(this).data('uid');
		const modal = $(this).closest('.modal');
		if(modal.length){
			$(modal[0]).modal('hide');
		}
		// Check if conversation exists on leftside, then click it.
		const userChat = $(`#all-chat a li[data-chat=${chatId}]`);
		if(userChat.length){
			userChat.trigger('click');
			return;
		} 

		// Get all conversation (by contact id) and click it.
		const skipNumberGroup = $('#all-chat ul li.group-chat').length;
		const skipNumberPerson = $('#all-chat ul li:not(.group-chat)').length;
		$.get(`/message/read-all-conversation-remaining?contact_id=${chatId}&skip_group=${skipNumberGroup}&skip_person=${skipNumberPerson}`, function (data) {
			const { readMoreConversationWithMess, moreGroupRemainingWithMembers } = data;

			// Load more conversations
			loadMoreConversation(readMoreConversationWithMess, moreGroupRemainingWithMembers);
			changeScreenChat();
			talkWithContact();
			checkUserOnline();
			nineScrollLeft();

			// Click It!!!
			$(`.person[data-chat=${chatId}]`).addClass('active').trigger('click');
		})
	})
}
