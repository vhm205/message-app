function createGroupChat() {
	$('#create-group-chat').off('click').on('click', function(e){
		const listUser = $('#friends-added li')
		const nameGroupChat = $('#name-group-chat').val()
		const amountUser = listUser.length

		if(!nameGroupChat){
			alertify.notify('Bạn chưa nhập tên group chat', 'error', 5)
			return
		}

		if(amountUser < 2){
			alertify.notify('Group chat phải có ít nhất 3 thành viên (bao gồm bạn)', 'error', 5)
			return
		}

		const listUserId = Array.from(listUser).map(val => $(val).data('uid'))
		const data = {
			name: nameGroupChat,
			amount: amountUser,
			members: listUserId
		}

		$.post("/group/add-new-group", data, function(data) {
			const { _id, name, messageAmount, userAmount, members } = data
			const conversation = {
				id: _id,
				groupname: name,
				avatar: './libraries/images/users/group-avatar-trungquandev.png'
			}
			const leftSideChatHtml = templateLeftSideChat(conversation)
			// Append contact into left side chat & right side chat
			$('#all-chat .people').prepend(leftSideChatHtml)
			$('#group-chat .people').prepend(leftSideChatHtml)

			// Everything done!!
			$('#friends-added').html('').parent().css('display', 'none')
			$('#group-chat-friends').html('')
			$('#name-group-chat').val('')
			$('#input-search-contact-to-add-group-chat').val('')
			$('#groupChatModal').modal('hide')
		}).fail(err => {
			alertify.notify(err.responseText, 'error', 5)
		})
	})
}

$(document).ready(function () {
	createGroupChat()
});
