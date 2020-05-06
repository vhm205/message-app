function ajaxLeaveGroupChat(groupId) {	
	$.ajax({
		type: "delete",
		url: "/group/user-leave-group",
		data: { groupId }
	}).done(data => {
		if(data.ok === 1){
			const members = $(`#membersModal_${groupId} ._membersList`);
			const listMemberId = [...members].map(member => $(member).data('uid'));
			const userAmount = $(`.right[data-chat=${groupId}] .number-members`).text().trim();
			socket.emit('user-leave-group', { groupId, listMemberId, userAmount: userAmount - 1 });

			$(`#screen-chat .right[data-chat=${groupId}]`).remove();
			$(`.group-chat[data-chat=${groupId}]`).parent().remove();
			$(`.all-attachment-modal #attachsModal_${groupId}`).remove();
			$(`.all-image-modal #imagesModal_${groupId}`).remove();
			$(`.all-members-modal #membersModal_${groupId}`).remove();
			$(`.all-stream-modal #streamModal_${groupId}`).remove();
		}
	}).fail(err => {
		alertify.notify(err.responseText, 'error', 5);
	})
}

function leaveGroupChat() {
	$('.user-leave-group').off('click').on('click', function () {
		const groupId = $(this).data('group');

		Swal.fire({
			title: 'Bạn có chắc muốn rời khỏi group?',
			text: 'Thao tác này không thể hoàn tác',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#2ECC71',
			cancelButtonColor: '#ff7675',
			confirmButtonText: 'Chấp nhận',
			cancelButtonText: 'Hủy'
		}).then(result => {
			if (result.value) ajaxLeaveGroupChat(groupId);
		})
	})
}

socket.on('response-user-leave-group', response => {
	const { userId, groupId, userAmount } = response;

	$(`#screen-chat .right[data-chat=${groupId}] .number-members`).text(userAmount);
	$(`#membersModal_${groupId} ._membersList[data-uid=${userId}]`).remove();
})
