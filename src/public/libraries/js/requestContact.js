function addRequestContact() {
    $('.user-add-new-contact').click(function() {
        const targetId = $(this).data('uid')

        $.post('/contact/add-request-contact', { uid: targetId }, function(data) {
            if(data.success){
				// Show button "Huy ket ban" and show Hidden "Them ban"
                $('#find-user').find(`.user-add-new-contact[data-uid=${targetId}]`).hide()
                $('#find-user').find(`.user-remove-request-contact[data-uid=${targetId}]`).css('display', 'inline-block')
				increaseNumberQueueContact('count-request-contact-sent', true)

				// Send request add contact realtime
                socket.emit('request-add-contact', { contactId: targetId })
            }
        })
    })
}

function cancelRequestContact() {
    $('.user-remove-request-contact').click(function() {
        const targetId = $(this).data('uid')

        $.ajax({
            url: '/contact/cancel-request-contact',
            type: 'delete',
            data: { uid: targetId }
        })
        .done(data => {
            if(data.success){
				// Hidden button "Huy ket ban" and show button "Them ban"
                $('#find-user').find(`.user-remove-request-contact[data-uid=${targetId}]`).hide()
                $('#find-user').find(`.user-add-new-contact[data-uid=${targetId}]`).css('display', 'inline-block')
				decreaseNumberQueueContact('count-request-contact-sent', true)

				// Send request cancel contact realtime
                socket.emit('request-cancel-contact', { contactId: targetId })
            }
        })
        .fail(err => console.error(err))
    })
}

socket.on('response-request-add-contact', user => {
	const notify = `<div class="notify-readed-false" data-uid="${user.id}">
						<img class="avatar-small" src="./libraries/images/users/${user.avatar}" alt=""> 
						<strong>${user.username}</strong> đã gửi cho bạn 1 lời mời kết bạn
					</div>`;
	// Popup notification
	$('.noti_content').prepend(notify) 
	// Modal notification
	$('.list-notification').prepend(`<li>${notify}</li>`) 

	increaseNumberQueueContact('count-request-contact-received', true)
	increaseNumberQueueContact('noti_contact_counter', false)
	increaseNumberQueueContact('noti_counter', false)
})

socket.on('response-request-cancel-contact', user => {
	// Popup notification
	$('.noti_content').find(`div[data-uid=${user.id}]`).remove()
	// Modal notification
	$('.list-notification > li').find(`div[data-uid=${user.id}]`).parent().remove()

	decreaseNumberQueueContact('count-request-contact-received', true)
	decreaseNumberQueueContact('noti_contact_counter', false)
	decreaseNumberQueueContact('noti_counter', false)
})
