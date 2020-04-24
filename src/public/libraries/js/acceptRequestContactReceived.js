function talkWithContact() {
	$('.user-talk').off('click').on('click', function() {
		const chatId = $(this).data('uid');
		const modal = $(this).closest('.modal');
		if(modal.length){
			$(modal[0]).modal('hide');
			$(`#all-chat a li[data-chat=${chatId}]`).trigger('click');
		}
	})
}

function templateLeftSideChatPersonal(conversation) {
	return `
		<a href="#uid_${conversation.id}" class="room-chat" data-target="#to_${conversation.id}">
			<li class="person" data-chat="${conversation.id}">
				<div class="left-avatar">
					<div class="dot"></div>
					<img src="${conversation.avatar}" alt="Thumb - Contact">
				</div>
				<span class="name">
					${conversation.username.length > 15 ? 
						conversation.username.substr(0, 15) + '...' :
						conversation.username
					}
				</span>
				<span class="time"></span>
				<span class="preview convert-emoji"></span>
			</li>
		</a>
	`;
}

function templateLeftSideChatGroup(conversation) {
	return `
		<a href="#uid_${conversation.id}" class="room-chat" data-target="#to_${conversation.id}">
			<li class="person group-chat" data-chat="${conversation.id}">
				<div class="left-avatar">
					<img src="${conversation.avatar}" alt="Thumb - Group">
				</div>
				<span class="name">
					<span class="group-chat-name">
						${conversation.groupname.length > 15 ? 
							conversation.groupname.substr(0, 15) + '...' :
							conversation.groupname
						}
					</span> 
				</span>
				<span class="time"></span>
				<span class="preview convert-emoji"></span>
			</li>
		</a>
	`;
}

function templateRightSideChatPersonal(conversation) {
	return `
	<div class="right tab-pane" data-chat="${conversation.id}" id="to_${conversation.id}">
		<div class="top">
			<span>To: <span class="name">${conversation.username}</span></span>
			<span class="chat-menu-right">
				<a href="#attachsModal_${conversation.id}" class="show-attachs" data-toggle="modal">
					Tệp đính kèm
					<i class="fa fa-paperclip"></i>
				</a>
			</span>
			<span class="chat-menu-right">
				<a href="javascript:void(0)">&nbsp;</a>
			</span>
			<span class="chat-menu-right">
				<a href="#imagesModal_${conversation.id}" class="show-images" data-toggle="modal">
					Hình ảnh
					<i class="fa fa-photo"></i>
				</a>
			</span>
		</div>
		<div class="content-chat">
			<div class="chat" data-chat="${conversation.id}"></div>
		</div>
		<div class="write" data-chat="${conversation.id}">
			<input type="text" class="write-chat" data-chat="${conversation.id}">
			<div class="icons">
				<a href="#" class="icon-chat" data-chat="${conversation.id}"><i class="fa fa-smile-o"></i></a>
				<label for="image-chat-${conversation.id}">
					<input type="file" id="image-chat-${conversation.id}" name="my-image-chat" class="image-chat" data-chat="${conversation.id}">
					<i class="fa fa-photo"></i>
				</label>
				<label for="attach-chat-${conversation.id}">
					<input type="file" id="attach-chat-${conversation.id}" name="my-attach-chat" class="attach-chat" data-chat="${conversation.id}">
					<i class="fa fa-paperclip"></i>
				</label>
				<a href="#streamModal" id="video-chat-${conversation.id}" class="video-chat" data-chat="${conversation.id}" data-toggle="modal">
					<i class="fa fa-video-camera"></i>
				</a>
				<input type="hidden" id="peer-id" value="">
			</div>
		</div>
	</div>
	`;
}

function templateRightSideChatGroup(conversation) {
	return `
	<div class="right tab-pane" data-chat="${conversation.id}" id="to_${conversation.id}">
		<div class="top">
			<span>To: <span class="name">${conversation.groupname}</span></span>
			<span class="chat-menu-right">
				<a href="#attachsModal_${conversation.id}" class="show-attachs" data-toggle="modal"> Tệp đính kèm <i class="fa fa-paperclip"></i>
				</a>
			</span>
			<span class="chat-menu-right">
				<a href="javascript:void(0)">&nbsp;</a>
			</span>
			<span class="chat-menu-right">
				<a href="#imagesModal_${conversation.id}" class="show-images" data-toggle="modal"> Hình ảnh <i class="fa fa-photo"></i> </a>
			</span>
			<span class="chat-menu-right">
				<a href="javascript:void(0)">&nbsp;</a>
			</span>
			<span class="chat-menu-right">
				<a href="#membersModal_${conversation.id}" class="show-number-members" data-toggle="modal">
					<span class="number-members">${conversation.userAmount}</span>
					<i class="fa fa-users"></i>
				</a>
			</span>
			<span class="chat-menu-right">
				<a href="javascript:void(0)">&nbsp;</a>
			</span>
			<span class="chat-menu-right">
				<a href="javascript:void(0)">
					<span class="number-messages">${conversation.messageAmount}</span>
					<i class="fa fa-comments-o"></i>
				</a>
			</span>
		</div>
		<div class="content-chat">
			<div class="chat" data-chat="${conversation.id}"></div>
		</div>
		<div class="write" data-chat="${conversation.id}">
			<input type="text" class="write-chat input-chat-group" data-chat="${conversation.id}">
			<div class="icons">
				<a href="#" class="icon-chat" data-chat="${conversation.id}"><i class="fa fa-smile-o"></i></a>
				<label for="image-chat-${conversation.id}">
					<input type="file" id="image-chat-${conversation.id}" name="my-image-chat" class="image-chat input-chat-group" data-chat="${conversation.id}" accept="image/*">
					<i class="fa fa-photo"></i>
				</label>
				<label for="attach-chat-${conversation.id}">
					<input type="file" id="attach-chat-${conversation.id}" name="my-attach-chat" class="attach-chat input-chat-group" data-chat="${conversation.id}">
					<i class="fa fa-paperclip"></i>
				</label>
				<a href="#streamModal" id="video-chat" class="video-chat input-chat-group" data-chat="${conversation.id}" data-toggle="modal">
					<i class="fa fa-video-camera"></i>
				</a>
				<input type="hidden" id="peer-id" value="">
			</div>
		</div>
	</div>
	`;
}

function templateModalImage(conversationId) {
	return `
	<div class="modal fade" id="imagesModal_${conversationId}" role="dialog">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">Tất cả các hình ảnh trong cuộc trò chuyện.</h4>
				</div>
				<div class="modal-body">
					<div class="all-images" style="visibility: hidden;"></div>
				</div>
			</div>
		</div>
	</div>
	`;
}

function templateModalAttachment(conversationId) {
	return `
	<div class="modal fade" id="attachsModal_${conversationId}" role="dialog">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">Tất cả các file trong cuộc trò chuyện.</h4>
				</div>
				<div class="modal-body">
					<ul class="list-attachs"></ul>
				</div>
			</div>
		</div>
	</div>
	`;
}

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

				const avatarSrc = userInfo.find('.user-avatar img').attr('src')
				const username = userInfo.find('.user-name p').text().trim()
				const conversation = {
					id: targetId,
					username: username,
					avatar: avatarSrc
				}
				const leftSideChatHtml = templateLeftSideChatPersonal(conversation)
				const rightSideChatHtml = templateRightSideChatPersonal(conversation)
				const modalImageHtml = templateModalImage(targetId)
				const modalAttachmentHtml = templateModalAttachment(targetId)

				// Append contact into left side chat & right side chat
				$('#all-chat .people').prepend(leftSideChatHtml)
				$('#user-chat .people').prepend(leftSideChatHtml)
				$('#screen-chat').prepend(rightSideChatHtml)
				$('.all-image-modal').append(modalImageHtml)
				$('.all-attachment-modal').append(modalAttachmentHtml)

				changeScreenChat()
				removeContact()
				talkWithContact()

				$(`.person[data-chat=${targetId}]`).addClass('active').trigger('click')

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

	const conversation = {
		id: user.id,
		username: user.username,
		avatar: `./libraries/images/users/${user.avatar}`
	}
	const leftSideChatHtml = templateLeftSideChatPersonal(conversation)
	const rightSideChatHtml = templateRightSideChatPersonal(conversation)
	const modalImageHtml = templateModalImage(user.id)
	const modalAttachmentHtml = templateModalAttachment(user.id)

	// Append contact into left side chat & right side chat
	$('#all-chat .people').prepend(leftSideChatHtml)
	$('#user-chat .people').prepend(leftSideChatHtml)
	$('#screen-chat').prepend(rightSideChatHtml)
	$('.all-image-modal').append(modalImageHtml)
	$('.all-attachment-modal').append(modalAttachmentHtml)

	changeScreenChat()
	removeContact()
	talkWithContact()
})

$(document).ready(function() {
	acceptRequestContactReceived()
	talkWithContact()
})
