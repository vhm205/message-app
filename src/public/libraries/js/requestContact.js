function addRequestContact() {
    $('.user-add-new-contact').off('click').on('click', function() {
        const targetId = $(this).data('uid')

        $.post('/contact/add-request-contact', { uid: targetId }, function(data) {
            if(data.success){
				// Show button "Huy ket ban" and show Hidden "Them ban"
                $('#find-user').find(`.user-add-new-contact[data-uid=${targetId}]`).hide()
                $('#find-user').find(`.user-remove-request-contact[data-uid=${targetId}]`).css('display', 'inline-block')
				increaseNumberQueueContact('count-request-contact-sent', true)

				// DOM HTML of user found it, Then append tab request contact sent
				const userInfoHtml = $('#find-user ul').find(`li[data-uid=${targetId}]`).get(0).outerHTML
				$('#request-contact-sent ul').prepend(userInfoHtml)
				removeRequestContact()

				// Send request add contact realtime
                socket.emit('request-add-contact', { contactId: targetId })
            }
        })
    })
}

function removeRequestContact() {
    $('.user-remove-request-contact').off('click').on('click', function() {
        const targetId = $(this).data('uid')

        $.ajax({
            url: '/contact/remove-request-contact',
            type: 'delete',
            data: { uid: targetId }
        })
        .done(data => {
            if(data.success){
				// Hidden button "Huy ket ban" and show button "Them ban"
                $('#find-user').find(`.user-remove-request-contact[data-uid=${targetId}]`).hide()
                $('#find-user').find(`.user-add-new-contact[data-uid=${targetId}]`).css('display', 'inline-block')
				decreaseNumberQueueContact('count-request-contact-sent', true)

				// Remove user in request contact sent
				$('#request-contact-sent ul').find(`li[data-uid=${targetId}]`).remove()

				// Send request cancel contact realtime
                socket.emit('remove-request-contact', { contactId: targetId })
            }
        })
        .fail(err => console.error(err))
    })
}

function removeRequestContactReceived() {
    $('.user-remove-request-contact-received').off('click').on('click', function() {
        const targetId = $(this).data('uid')

        $.ajax({
            url: '/contact/remove-request-contact-received',
            type: 'delete',
            data: { uid: targetId }
        })
        .done(data => {
            if(data.success){
				decreaseNumberQueueContact('noti_contact_counter', false) // Notif on navbar 
				decreaseNumberQueueContact('count-request-contact-received', true) // Notif in modal

				// Popup notification
				// $('.noti_content').find(`div[data-uid=${user.id}]`).remove()
				// Modal notification
				// $('.list-notification > li').find(`div[data-uid=${user.id}]`).parent().remove()

				// Remove user in request contact received
				$('#request-contact-received ul').find(`li[data-uid=${targetId}]`).remove()

				// Send request cancel contact realtime
                socket.emit('remove-request-contact-received', { contactId: targetId })
            }
        })
        .fail(err => console.error(err))
    })
}

socket.on('response-request-add-contact', user => {
	const notify = `
		<div class="notify-readed-false" data-uid="${user.id}">
			<img class="avatar-small" src="./libraries/images/users/${user.avatar}" alt="Notify"> 
			<strong>${user.username}</strong> đã gửi cho bạn 1 lời mời kết bạn
		</div>`;
	// Popup notification
	$('.noti_content').prepend(notify) 
	// Modal notification
	$('.list-notification').prepend(`<li>${notify}</li>`)

	increaseNumberQueueContact('count-request-contact-received', true)
	increaseNumberQueueContact('noti_contact_counter', false)
	increaseNumberQueueContact('noti_counter', false)

	const userInfoHtml = `
	<li class="_contactList" data-uid="${user.id}">
		<div class="contactPanel">
			<div class="user-avatar">
				<img src="./libraries/images/users/${user.avatar}" alt="Avatar Sender">
			</div>
			<div class="user-name">
				<p> ${user.username} </p>
			</div>
			<br>
			<div class="user-address">
				<span>&nbsp ${user.address}</span>
			</div>
			<div class="user-accept-request-contact-received" data-uid="${user.id}">
				Chấp nhận
			</div>
			<div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
				Xóa yêu cầu
			</div>
		</div>
	</li>`
	$('#request-contact-received ul').prepend(userInfoHtml)
	removeRequestContactReceived()
	acceptRequestContactReceived()
})

socket.on('response-remove-request-contact', user => {
	// Popup notification
	$('.noti_content').find(`div[data-uid=${user.id}]`).first().remove()
	// Modal notification
	$('.list-notification > li').find(`div[data-uid=${user.id}]`).first().parent().remove()

	// Remove user in request contact received
	$('#request-contact-received ul').find(`li[data-uid=${user.id}]`).remove()

	decreaseNumberQueueContact('count-request-contact-received', true)
	decreaseNumberQueueContact('noti_contact_counter', false)
	decreaseNumberQueueContact('noti_counter', false)
})

socket.on('response-remove-request-contact-received', user => {
	// Hidden button "Huy ket ban" and show button "Them ban"
	$('#find-user').find(`.user-remove-request-contact[data-uid=${user.id}]`).hide()
	$('#find-user').find(`.user-add-new-contact[data-uid=${user.id}]`).css('display', 'inline-block')

	// Remove user in request contact sent
	$('#request-contact-sent ul').find(`li[data-uid=${user.id}]`).remove()

	decreaseNumberQueueContact('count-request-contact-sent', true) // Notif on modal
	decreaseNumberQueueContact('noti_contact_counter', false) // Notif on navbar 
})

$(document).ready(function() {
	removeRequestContact();
	removeRequestContactReceived();
})
