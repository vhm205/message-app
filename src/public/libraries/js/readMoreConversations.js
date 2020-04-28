$(document).ready(function() {
	$('#read-more-all-chat').click(function() {
		let skipNumberGroup = $('#all-chat ul li.group-chat').length;
		let skipNumberPerson = $('#all-chat ul li:not(.mark):not(.group-chat)').length;

		$('.read-more-all-chat-loader').css('display', 'block');
		$(this).css('display', 'none');

		$.get(`/message/read-more-conversations?skip_group=${skipNumberGroup}&skip_person=${skipNumberPerson}`, function(data){
			const { moreConversations, moreGroupWithMembers } = data;
			console.log(data);

			if(!moreConversations.length){
				$('.read-more-all-chat').html('');
				return;
			}

			// Init variable
			const listCurrentContactId = Array.from($('#all-chat ul li:not(.group-chat)')).map(contact => $(contact).data('chat'));
			const currentUserId = $('#dropdown-navbar-user').data('uid');
			const allAttachmentModal = $('.all-attachment-modal');
			const allImageModal = $('.all-image-modal');
			const allMemberModal = $('.all-members-modal');
			const allChat = $('#all-chat ul');
			const userChat = $('#user-chat ul');
			const groupChat = $('#group-chat ul');
			const screenChat = $('#screen-chat');

			let rightSideChat = '';
			let imageModal = '';
			let attachmentModal = '';
			let memberModal = '';

			// Load more conversation
			moreConversations.map(conversation => {
				// Check conversation is exists, then remove conversation
				if(listCurrentContactId.includes(conversation._id)){
					allChat.find(`li[data-chat=${conversation._id}]`).parent().remove();
					screenChat.find(`.right[data-chat=${conversation._id}]`).remove();
					allImageModal.find(`#imagesModal_${conversation._id}`).remove();
					allAttachmentModal.find(`#attachsModal_${conversation._id}`).remove();
				}
				if(conversation.members){ // Is Chat Group
					allChat.append(leftSideChatGroupWithData(conversation));
					groupChat.append(leftSideChatGroupWithData(conversation));
					rightSideChat += rightSideChatGroupWithData(conversation, currentUserId);
				} else{ // Is Chat Personal
					allChat.append(leftSideChatPersonalWithData(conversation));
					userChat.append(leftSideChatPersonalWithData(conversation));
					rightSideChat += rightSideChatPersonalWithData(conversation, currentUserId);
				}
				imageModal += modalImageWithData(conversation);
				attachmentModal += modalAttachmentWithData(conversation);
			})
			// Load more member modal in chat group
			moreGroupWithMembers.map(group => {
				memberModal += modalMemberWithData(group, currentUserId);
			})

			screenChat.append(rightSideChat);
			allAttachmentModal.append(attachmentModal);
			allImageModal.append(imageModal);
			allMemberModal.append(memberModal);

			nineScrollLeft();
			changeScreenChat();
			talkWithContact();
			checkUserOnline();

			$('.read-more-all-chat-loader').css('display', 'none');
			$(this).css('display', 'block');
		}.bind(this));
	})
})
