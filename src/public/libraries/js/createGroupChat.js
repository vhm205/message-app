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

		$.post("/group/add-new-group", data, function(data, textStatus) {
			console.log(data, textStatus);
		}).fail(err => {
			console.error(err);
		})
	})
}

$(document).ready(function () {
	createGroupChat()
});
