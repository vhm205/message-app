function addRequestContact() {
    $('.user-add-new-contact').click(function() {
        const targetId = $(this).data('uid')

        $.post('/contact/add-request-contact', { uid: targetId }, function(data) {
            if(data.success){
                $('#find-user').find(`.user-add-new-contact[data-uid=${targetId}]`).hide()
                $('#find-user').find(`.user-remove-request-contact[data-uid=${targetId}]`).css('display', 'inline-block')
                increaseNumberQueueContact('count-request-contact-sent', true)
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
                $('#find-user').find(`.user-remove-request-contact[data-uid=${targetId}]`).hide()
                $('#find-user').find(`.user-add-new-contact[data-uid=${targetId}]`).css('display', 'inline-block')
                decreaseNumberQueueContact('count-request-contact-sent', true)
                socket.emit('request-cancel-contact', { contactId: targetId })
            }
        })
        .fail(err => console.error(err))
    })
}

socket.on('response-request-add-contact', user => {
	const notify = `<span data-uid="${user.id}">
						<img class="avatar-small" src="./libraries/images/users/${user.avatar}" alt=""> 
						<strong>${user.username}</strong> đã gửi cho bạn 1 yêu cầu kết bạn
					</span><br><br><br>`
	$('.noti_content').prepend(notify)
	
	increaseNumberQueueContact('count-request-contact-received', true)
	increaseNumberQueueContact('noti_contact_counter', null)
	increaseNumberQueueContact('noti_counter', null)
})

socket.on('response-request-cancel-contact', user => {
	$('.noti_content').find(`span[data-uid=${user.id}]`).remove()

	decreaseNumberQueueContact('count-request-contact-received', true)
	decreaseNumberQueueContact('noti_contact_counter', null)
	decreaseNumberQueueContact('noti_counter', null)
})
