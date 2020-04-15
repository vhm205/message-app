function chatAttachment(chatId) {
	$(`#attach-chat-${chatId}`).off('change').on('change', function (e) {
		const fileData = $(this).prop('files')[0];
		const limit = 1048576;

		if(fileData.size > limit){
			alertify.notify('Tệp đính kèm tối đa 1MB', 'error', 5);
			$(this).val(null);
			return;
		}

		const isChatGroup = $(this).hasClass('input-chat-group') ? true : false;
		const frmData = new FormData();
		frmData.append('receiverId', chatId);
		frmData.append('attachment', fileData);
		frmData.append('isChatGroup', isChatGroup);

		$.ajax({
			type: "post",
			url: "/message/add-new-attachment",
			data: frmData,
			cache: false,
			processData: false,
			contentType: false
		}).done(data => {
			const { _id, sender, file, createdAt } = data.message;

			const messageOfMe = $(`<div class="me bubble bubble-attach-file" data-mess-id="${_id}"></div>`);
			const attachmentHtml = `
				<a href="data:${file.contentType}; base64, ${bufferToBase64(file.data.data)}" download="${file.fileName}" title="${new Date(createdAt).toLocaleString()}">
					${file.fileName}
				</a>
			`;

			if(isChatGroup){
				// Add small avatar beside the message
				messageOfMe.html(`<img src="./libraries/images/users/${sender.avatar}" class="avatar-small" title="${sender.name}" /> ${attachmentHtml}`);

				increaseNumberMessageGroup(chatId);
			} else{
				messageOfMe.html(attachmentHtml);
			}
			
			// Append Message & Scroll
			$(`.right .chat[data-chat=${chatId}]`).append(messageOfMe);
			nineScrollRight(chatId);

			// Update time and message preview
			const userLeft = $(`.person[data-chat=${chatId}]`);
			userLeft.find('.time').text(moment(createdAt).locale('vi').startOf('seconds').fromNow());
			userLeft.find('.preview').html('<i class="fa fa-file-text"></i> File đính kèm');

			// Move conversation to the top (event + .namespace)
			userLeft.on('moveTop.moveConversationToTop', function(){
				$(this).closest('ul').prepend($(this).parent());
				userLeft.off('moveTop.moveConversationToTop');
			})
			userLeft.trigger('moveTop.moveConversationToTop');
			
			// Handle realtime chat message attachment
			socket.emit('add-new-attachment-message', { message: data.message });

			// Append attachment to attachment modal
			const attachmentHtmlModal = `
				<li>
					<a href="data:${file.contentType}; base64, ${bufferToBase64(file.data.data)}" 
					download="${file.fileName}">
							${file.fileName}
					</a>
				</li>
			`;
			$(`#attachsModal_${chatId} .list-attachs`).append(attachmentHtmlModal);
		}).fail(err => {
			console.error(err);
			alertify.notify(err.responseText, 'error', 5)
		})
	})
}

socket.on('response-add-new-attachment-message', response => {
	const { _id, sender, senderId, receiverId, file, createdAt } = response.message;
	const currentUserId = $('#dropdown-navbar-user').data('uid');
	const messageOfYou = $(`<div class="you bubble bubble-attach-file" data-mess-id="${_id}"></div>`);
	const attachmentHtml = `
		<a href="data:${file.contentType}; base64, ${bufferToBase64(file.data.data)}" download="${file.fileName}" title="${new Date(createdAt).toLocaleString()}">
			${file.fileName}
		</a>
	`;

	const isChatGroup = response.conversationType === 'group';
	const chatId = isChatGroup ? receiverId : senderId;

	if(isChatGroup){
		// Add small avatar beside the message
		messageOfYou.html(`<img src="./libraries/images/users/${sender.avatar}" class="avatar-small" title="${sender.name}" /> ${attachmentHtml}`);

		if(senderId !== currentUserId) increaseNumberMessageGroup(chatId);
	} else{
		messageOfYou.html(attachmentHtml);
	}

	// Update time and preview message
	const userLeft = $(`.person[data-chat=${chatId}]`);
	userLeft.find('.time').text(moment(createdAt).locale('vi').startOf('seconds').fromNow());
	userLeft.find('.preview').html('<i class="fa fa-file-text"></i> File đính kèm');

	// If sender is not current user
	if(senderId !== currentUserId){
		// Append Message & Scroll
		$(`.right .chat[data-chat=${chatId}]`).append(messageOfYou);
		nineScrollRight(chatId);

		// Append attachment to attachment modal
		const attachmentHtmlModal = `
			<li>
				<a href="data:${file.contentType}; base64, ${bufferToBase64(file.data.data)}" 
				download="${file.fileName}">
						${file.fileName}
				</a>
			</li>
		`;
		$(`#attachsModal_${chatId} .list-attachs`).append(attachmentHtmlModal);

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
