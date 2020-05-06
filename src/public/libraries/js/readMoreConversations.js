$(document).ready(function() {
	$('#read-more-all-chat').click(function() {
		let skipNumberGroup = $('#all-chat ul li.group-chat').length;
		let skipNumberPerson = $('#all-chat ul li:not(.group-chat)').length;

		$('.read-more-all-chat-loader').css('display', 'block');
		$(this).css('display', 'none');

		$.get(`/message/read-more-conversations?skip_group=${skipNumberGroup}&skip_person=${skipNumberPerson}`, function(data){
			const { moreConversations, moreGroupWithMembers } = data;
			
			if(!moreConversations.length){
				$('.read-more-all-chat').html('');
				return;
			}

			// Load more conversations
			loadMoreConversation(moreConversations, moreGroupWithMembers);
			changeScreenChat();
			talkWithContact();
			checkUserOnline();
			nineScrollLeft();

			$('.read-more-all-chat-loader').css('display', 'none');
			$(this).css('display', 'block');
		}.bind(this));
	})
})
