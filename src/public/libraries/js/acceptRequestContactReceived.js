function acceptRequestContactReceived() {
    $('.user-accept-request-contact-received').off('click').on('click', function() {
		const targetId = $(this).data('uid')

        $.ajax({
            url: '/contact/accept-request-contact-received',
            type: 'patch',
            data: { uid: targetId }
        })
        .done(data => {
            if(data.success){
				const userInfo = $('#request-contact-received ul').find(`li[data-uid=${targetId}]`);
				$(userInfo).find('.user-accept-request-contact-received').remove()
				$(userInfo).find('.user-remove-request-contact-received').remove()
				$(userInfo).find('.contactPanel').append(`
					<div class="user-talk" data-uid="${targetId}">
						Trò chuyện
					</div>
					<div class="user-remove-contact action-danger" data-uid="${targetId}">
						Xóa liên hệ
					</div>
				`)
				$('#contacts ul').prepend(userInfo.get(0).outerHTML)
				$(userInfo).remove()

				// Notification in modal contact list
				increaseNumberQueueContact('count-contacts', true)
				// Notification on navbar 
				decreaseNumberQueueContact('noti_contact_counter', false)
				// Notification in modal request contact received
				decreaseNumberQueueContact('count-request-contact-received', true)

				// Send request cancel contact realtime
                socket.emit('accept-request-contact-received', { contactId: targetId })
            }
        })
        .fail(err => console.error(err))
    })
}

socket.on('response-accept-request-contact-received', user => {
	const notify = `
		<div class="notify-readed-false" data-uid="${user.id}">
			<img class="avatar-small" src="./libraries/images/users/${user.avatar}" alt="Notify"> 
			<strong>${user.username}</strong> đã chấp nhận lời mời kết bạn
		</div>`;
	// Popup notification
	$('.noti_content').prepend(notify) 
	// Modal notification
	$('.list-notification').prepend(`<li>${notify}</li>`)

	// Notification in modal contact list
	increaseNumberQueueContact('count-contacts', true)
	// Notification on navbar 
	increaseNumberQueueContact('noti_counter', false)
	// Notification in modal request contact received
	decreaseNumberQueueContact('count-request-contact-sent', true)
	// Notification on navbar (open modal)
	decreaseNumberQueueContact('noti_contact_counter', false)

	const userInfoHtml = `
		<li class="_contactList" data-uid="${user.id}">
			<div class="contactPanel">
				<div class="user-avatar">
					<img src="./libraries/images/users/${user.avatar}" alt="">
				</div>
				<div class="user-name">
					<p>
						${user.username}
					</p>
				</div>
				<br>
				<div class="user-address">
					<span>&nbsp ${user.address}</span>
				</div>
				<div class="user-talk" data-uid="${user.id}">
					Trò chuyện
				</div>
				<div class="user-remove-contact action-danger" data-uid="${user.id}">
					Xóa liên hệ
				</div>
			</div>
		</li>
	`
	$('#request-contact-sent ul').find(`li[data-uid=${user.id}]`).remove()
	$('#find-user ul').find(`li[data-uid=${user.id}]`).remove()
	$('#contacts ul').prepend(userInfoHtml)
})

$(document).ready(function() {
	acceptRequestContactReceived();
})
