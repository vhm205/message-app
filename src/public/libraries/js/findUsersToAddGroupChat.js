function findUsersToAddGroupChat(e) {
	if(e.keyCode === 13 || e.type === 'click'){
        const keyword = $('#input-search-contact-to-add-group-chat').val();

        if(!keyword.length){
            alertify.notify('Bạn cần nhập username hoặc email để tìm kiếm', 'warning');
            return;
        }

        $.get(`/group/find-user?keyword=${keyword}`, function(data) {
			$('#group-chat-friends').html(data)
			// Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
			addFriendsToGroup()
        }).fail(err => {
			alertify.notify(err.responseJSON[0], 'warning')
		})
    }
}

$(document).ready(function () {
	$('#input-search-contact-to-add-group-chat').on('keypress', findUsersToAddGroupChat)
	$('#btn-search-contact-to-add-group-chat').on('keypress', findUsersToAddGroupChat)
});
