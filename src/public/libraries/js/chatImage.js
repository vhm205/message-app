function bufferToBase64(buffer) {
	return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

function chatImage(chatId) {
	$(`#image-chat-${chatId}`).off('change').on('change', function(e){
		const fileData = $(this).prop('files')[0];
		const typesAccept = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
		const limit = 1048576;

		if($.inArray(fileData.type, typesAccept) === -1){
			alertify.notify('Kiểu file không hợp lệ, chỉ chấp nhận file có định dạng png, jpg, jpeg, gif', 'error', 8);
			$(this).val(null);
			return;
		}

		if(fileData.size > limit){
			alertify.notify('Ảnh upload tối đa 1MB', 'error', 5);
			$(this).val(null);
			return;
		}

		const isChatGroup = $(this).hasClass('input-chat-group') ? true : false;
		const frmData = new FormData();
		frmData.append('receiverId', chatId);
		frmData.append('image', fileData);
		frmData.append('isChatGroup', isChatGroup);
		
		$.ajax({
			type: "post",
			url: "/message/add-new-image",
			data: frmData,
			cache: false,
			processData: false,
			contentType: false
		}).done(data => {
			const { _id, sender, file, createdAt } = data.message;

			const messageOfMe = $(`<div class="me bubble bubble-image-file" data-mess-id="${_id}"></div>`);
			const imageHtml = `<img src="data:${file.contentType}; base64, ${bufferToBase64(file.data.data)}" class="show-image-chat" title="${new Date(createdAt).toLocaleString()}">`;
			
			if(isChatGroup){
				// Add small avatar beside the message
				messageOfMe.html(`<img src="./libraries/images/users/${sender.avatar}" class="avatar-small" title="${sender.name}" /> ${imageHtml}`);

				// Increase number message in group
				increaseNumberMessageGroup(chatId);
			} else{
				messageOfMe.html(imageHtml);
			}
			
			// Append Message & Scroll
			$(`.right .chat[data-chat=${chatId}]`).append(messageOfMe);
			nineScrollRight(chatId);

			// Update time and message preview
			const userLeft = $(`.person[data-chat=${chatId}]`);
			userLeft.find('.time').text(moment(createdAt).locale('vi').startOf('seconds').fromNow());
			userLeft.find('.preview').html('<i class="fa fa-file-image-o"></i> Hình ảnh');

			// Move conversation to the top (event + .namespace)
			userLeft.on('moveTop.moveConversationToTop', function(){
				$(this).closest('ul').prepend($(this).parent());
				userLeft.off('moveTop.moveConversationToTop');
			})
			userLeft.trigger('moveTop.moveConversationToTop');

			// Handle realtime chat message image
			socket.emit('add-new-image-message', { message: data.message });

			// Append image to image modal
			const imageHtmlModal = `<img src="data:${file.contentType}; base64, ${bufferToBase64(file.data.data)}">`;
			$(`#imagesModal_${chatId} .all-images`).append(imageHtmlModal);
		}).fail(err => {
			alertify.notify(err.responseText, 'error', 5)
		})
	})
}

socket.on('response-add-new-image-message', response => {
	const { _id, sender, senderId, receiverId, file, createdAt } = response.message;
	const currentUserId = $('#dropdown-navbar-user').data('uid');
	const messageOfYou = $(`<div class="you bubble bubble-image-file" data-mess-id="${_id}"></div>`);
	const imageHtml = `<img src="data:${file.contentType}; base64, ${bufferToBase64(file.data.data)}" class="show-image-chat" title="${new Date(createdAt).toLocaleString()}">`;

	const isChatGroup = response.conversationType === 'group';
	const chatId = isChatGroup ? receiverId : senderId;
	
	if(isChatGroup){
		// Add small avatar beside the message
		messageOfYou.html(`<img src="./libraries/images/users/${sender.avatar}" class="avatar-small" title="${sender.name}" /> ${imageHtml}`);

		// Increase number message in group
		if(senderId !== currentUserId) increaseNumberMessageGroup(chatId);
	} else{
		messageOfYou.html(imageHtml);
	}

	// Update time and preview message
	const userLeft = $(`.person[data-chat=${chatId}]`);
	userLeft.find('.time').text(moment(createdAt).locale('vi').startOf('seconds').fromNow());
	userLeft.find('.preview').html('<i class="fa fa-file-image-o"></i> Hình ảnh');

	// If sender is not current user
	if(senderId !== currentUserId){
		// Append Message & Scroll
		$(`.right .chat[data-chat=${chatId}]`).append(messageOfYou);
		nineScrollRight(chatId);

		// Append image to image modal
		const imageHtmlModal = `<img src="data:${file.contentType}; base64, ${bufferToBase64(file.data.data)}">`;
		$(`#imagesModal_${chatId} .all-images`).append(imageHtmlModal);

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
