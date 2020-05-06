function ajaxCreateGroupChat(data) {
	$.post("/group/add-new-group", data, function (data) {
		const { _id, name, userId, messageAmount, userAmount } = data
		const conversation = {
			id: _id,
			adminId: userId,
			groupname: name,
			messageAmount: messageAmount,
			userAmount: userAmount,
			avatar: './libraries/images/users/group-avatar.png'
		}
		
		const currentUserId = $('#dropdown-navbar-user').data('uid')
		const leftSideChatHtml = templateLeftSideChatGroup(conversation)
		const rightSideChatHtml = templateRightSideChatGroup(conversation, currentUserId)
		const modalImageHtml = templateModalImage(_id)
		const modalAttachmentHtml = templateModalAttachment(_id)
		const modalMemberHtml = modalMemberWithData(data, currentUserId)
		// Append contact into left side chat & right side chat
		$('#all-chat .people').prepend(leftSideChatHtml)
		$('#group-chat .people').prepend(leftSideChatHtml)
		$('#screen-chat').prepend(rightSideChatHtml)
		$('.all-image-modal').append(modalImageHtml)
		$('.all-attachment-modal').append(modalAttachmentHtml)
		$('.all-members-modal').append(modalMemberHtml)

		changeScreenChat()
		talkWithContact()
		socket.emit('create-new-group-chat', { data: data })
		socket.emit('push-id-to-socket', { id: _id })
		$(`.group-chat[data-chat=${_id}]`).addClass('active').trigger('click')

		// Everything done!!
		$('#friends-added').html('').parent().css('display', 'none')
		$('#group-chat-friends').html('')
		$('#name-group-chat').val('')
		$('#input-search-contact-to-add-group-chat').val('')
		$('#groupChatModal').modal('hide')
	}).fail(err => {
		if ('responseJSON' in err) {
			err.responseJSON.map(e => {
				alertify.notify(e, 'error', 5)
			})
		}
	})
}

function createGroupChat() {
	$('#create-group-chat').off('click').on('click', function () {
		const listUser = $('#friends-added li')
		const nameGroupChat = $('#name-group-chat').val().trim()
		const amountUser = listUser.length

		if (!nameGroupChat.length) {
			alertify.notify('Bạn chưa nhập tên group chat', 'error', 5)
			return
		}

		if (amountUser < 2) {
			alertify.notify('Group chat phải có ít nhất 3 thành viên (bao gồm bạn)', 'error', 5)
			return
		}

		const listUserId = Array.from(listUser).map(val => $(val).data('uid'))
		const data = {
			name: nameGroupChat,
			amount: amountUser,
			members: listUserId
		}

		Swal.fire({
			title: 'Bạn có chắc muốn tạo group chat?',
			text: 'Thao tác này không thể hoàn tác',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#2ECC71',
			cancelButtonColor: '#ff7675',
			confirmButtonText: 'Chấp nhận',
			cancelButtonText: 'Hủy'
		}).then(result => {
			if (result.value) ajaxCreateGroupChat(data);
		})
	})
}

socket.on('response-create-new-group-chat', response => {
	const { _id, name, messageAmount, userAmount, sender, avatar } = response
	const notify = `
		<div class="notify-readed-false" data-uid="${_id}">
			<img class="avatar-small" src="./libraries/images/users/${avatar}" alt="Notification"> 
			<strong>${sender}</strong> đã thêm bạn vào một nhóm chat
		</div>
	`;
	// Popup notification
	$('.noti_content').prepend(notify)
	// Modal notification
	$('.list-notification').prepend(`<li>${notify}</li>`)
	// Notification on navbar 
	increaseNumberQueueContact('noti_counter', false)

	const conversation = {
		id: _id,
		groupname: name,
		messageAmount: messageAmount,
		userAmount: userAmount,
		avatar: './libraries/images/users/group-avatar.png'
	}
	const currentUserId = $('#dropdown-navbar-user').data('uid')
	const leftSideChatHtml = templateLeftSideChatGroup(conversation)
	const rightSideChatHtml = templateRightSideChatGroup(conversation, currentUserId)
	const modalImageHtml = templateModalImage(_id)
	const modalAttachmentHtml = templateModalAttachment(_id)
	const modalMemberHtml = modalMemberWithData(response, currentUserId)
	// Append contact into left side chat & right side chat
	$('#all-chat .people').prepend(leftSideChatHtml)
	$('#group-chat .people').prepend(leftSideChatHtml)
	$('#screen-chat').prepend(rightSideChatHtml)
	$('.all-image-modal').append(modalImageHtml)
	$('.all-attachment-modal').append(modalAttachmentHtml)
	$('.all-members-modal').append(modalMemberHtml)

	socket.emit('push-id-to-socket', { id: _id })
	changeScreenChat()
})

$(document).ready(function () {
	createGroupChat()
})
