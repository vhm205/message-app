function removeContact() {
    $('.user-remove-contact').off('click').on('click', function() {
		const targetId = $(this).data('uid')
		const username = $(this).siblings('.user-name').find('p').text().trim()

		Swal.fire({
			title: `<span>Bạn có chắc chắn muốn xóa <b style="color:red">${username}</b> khỏi danh sách bạn bè?</span>`,
			text: 'Thao tác này không thể hoàn tác',
			icon: 'question',
			width: '60%',
			showCancelButton: true,
			confirmButtonColor: '#2ECC71',
			cancelButtonColor: '#ff7675',
			confirmButtonText: 'Chấp nhận',
			cancelButtonText: 'Hủy'
		}).then(result => {
			if (!result.value) return;

			$.ajax({
				url: '/contact/remove-contact',
				type: 'delete',
				data: { uid: targetId }
			})
			.done(data => {
				if(data.success){
					// Notification in modal contact list
					decreaseNumberQueueContact('count-contacts', true)
					// Remove contact from list contact
					$('#contacts ul').find(`li[data-uid=${targetId}]`).remove()

					// Send request cancel contact realtime
					socket.emit('remove-contact', { contactId: targetId })

					// Delete left side & right side, Everything about contact
					$(`.person[data-chat=${targetId}]`).parent().remove()
					$(`.all-image-modal #imagesModal_${targetId}`).remove()
					$(`.all-attachment-modal #attachsModal_${targetId}`).remove()
					$(`#screen-chat div[data-chat=${targetId}]`).remove()
				}
			})
			.fail(err => console.error(err))
		})
    })
}

socket.on('response-remove-contact', user => {
	// Notification in modal contact list
	decreaseNumberQueueContact('count-contacts', true)

	// Remove contact from list contact
	$('#contacts ul').find(`li[data-uid=${user.id}]`).remove()

	// Delete left side & right side, Everything about contact
	$(`.person[data-chat=${user.id}]`).parent().remove()
	$(`.all-image-modal #imagesModal_${user.id}`).remove()
	$(`.all-attachment-modal #attachsModal_${user.id}`).remove()
	$(`#screen-chat div[data-chat=${user.id}]`).remove()
})

$(document).ready(function() {
	removeContact();
})
