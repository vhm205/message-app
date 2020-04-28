function getTimeAndPreviewLeftSide(data) {
	// getLastIndex in mainConfig.js
	const lastMessage = getLastIndex(data.messages);
	let preview = '';
	switch (lastMessage.messageType) {
		case 'text':
			preview = lastMessage.text;
			break;
		case 'image':
			preview = '<i class="fa fa-file-image-o"></i> Hình ảnh';
			break;
		case 'file':
			preview = '<i class="fa fa-file-text"></i> File đính kèm';
			break;
	}
	return [lastMessage, preview];
}

function getMessagesRightSide(messages, currentUserId) {
	let mess = '';
	messages.map(message => {
		if(message.messageType === 'text') {
			mess += `
			<div class="convert-emoji bubble ${(message.senderId == currentUserId) ? "me" : "you"}"
				data-mess-id="${message._id}">
				<span title="${new Date(message.createdAt).toLocaleString()}">
					${message.text}
				</span>
			</div>`;
		}
		if(message.messageType === 'image') {
			mess += `
			<div class="bubble bubble-image-file ${(message.senderId == currentUserId) ? "me" : "you"}" data-mess-id="${message._id}">
				<img src="data:${message.file.contentType}; base64, ${bufferToBase64(message.file.data.data)}" class="show-image-chat" title="${new Date(message.createdAt).toLocaleString()}">
			</div>`;
		}
		if(message.messageType === 'file') {
			mess += `
			<div class="bubble bubble-attach-file ${(message.senderId == currentUserId) ? "me" : "you"}" data-mess-id="${message._id}">
				<a href="data:${message.file.contentType}; base64, ${bufferToBase64(message.file.data.data)}" 
					download="${message.file.fileName}"
					title="${new Date(message.createdAt).toLocaleString()}">
					${message.file.fileName}
				</a>
			</div>`;
		}
	})
	return mess;
}

function getMembersGroup(members, groupId, currentUserId) {
	let membersStr = '';
	members.map(member => {
		membersStr += `
			<li class="_membersList">
				<div class="user-avatar">
					<img src="./libraries/images/users/${member.avatar}" alt="Thumb Group">
				</div>
				${(member._id.toString() === currentUserId && member._id.toString() === groupId.toString()) ? (
					`<div class="user-name user-admin">
						${member.username}
						<div>(Bạn là Admin)</div>
					</div>`
				) : ((member._id.toString() === currentUserId && member._id.toString() !== groupId.toString()) ? (
					`<div class="user-name">
						${member.username}
						<div>(Bạn)</div>
					</div>`
				) : (member._id.toString() === groupId.toString()) ? (
					`<div class="user-name user-admin">
						${member.username}
						<div>(Admin)</div>
					</div>
					<br>
					<div class="user-talk" data-uid="${member._id}">
						Trò chuyện
					</div>`
				) : (
					member.status ? (
						`<div class="user-name">
							${member.username}
						</div>
						<br>
						<div class="user-talk" data-uid="${member._id}">
							Trò chuyện
						</div>`
					) : (
						`<div class="user-name" style="color:#b3b0b0">
							${member.username}
							<div>(Chưa kết bạn)</div>
						</div>`
					)
				))}
			</li>`;
	});
	return membersStr;
}

function leftSideChatPersonalWithData(data) {
	const [lastMessage, preview] = getTimeAndPreviewLeftSide(data);
	return `
		<a href="#uid_${data._id}" class="room-chat" data-target="#to_${data._id}">
			<li class="person" data-chat="${data._id}">
				<div class="left-avatar">
					<div class="dot"></div>
					<img src="./libraries/images/users/${data.avatar}" alt="Thumb - Contact">
				</div>
				<span class="name">
					${data.username.length > 15 ? 
						data.username.substr(0, 15) + '...' :
						data.username
					}
				</span>
				<span class="time">
					${convertTimstampToHumanTime(lastMessage.createdAt)}
				</span>
				<span class="preview convert-emoji">
					${preview}
				</span>
			</li>
		</a>
	`;
}

function leftSideChatGroupWithData(data) {
	const [lastMessage, preview] = getTimeAndPreviewLeftSide(data);
	return `
		<a href="#uid_${data._id}" class="room-chat" data-target="#to_${data._id}">
			<li class="person group-chat" data-chat="${data._id}">
				<div class="left-avatar">
					<!-- <div class="dot"></div> -->
					<img src="./libraries/images/users/group-avatar.png" alt="Thumb - Group">
				</div>
				<span class="name">
					<span class="group-chat-name">
						${data.name.length > 15 ? 
							data.name.substr(0, 15) + '...' :
							data.name
						}
					</span> 
				</span>
				<span class="time">
					${convertTimstampToHumanTime(lastMessage.createdAt)}
				</span>
				<span class="preview convert-emoji">
					${preview}
				</span>
			</li>
		</a>
	`;
}

function rightSideChatPersonalWithData(data, currentUserId) {
	const messages = getMessagesRightSide(data.messages, currentUserId)
	return `
		<div class="right tab-pane" data-chat="${data._id}"
			id="to_${data._id}">
			<div class="top">
				<span>To: <span class="name">${data.username}</span></span>
				<span class="chat-menu-right">
					<a href="#attachsModal_${data._id}" class="show-attachs" data-toggle="modal">
						Tệp đính kèm <i class="fa fa-paperclip"></i>
					</a>
				</span>
				<span class="chat-menu-right">
					<a href="javascript:void(0)">&nbsp;</a>
				</span>
				<span class="chat-menu-right">
					<a href="#imagesModal_${data._id}" class="show-images" data-toggle="modal">
						Hình ảnh <i class="fa fa-photo"></i>
					</a>
				</span>
			</div>
			<div class="content-chat">
				<div class="chat" data-chat="${data._id}">
					${messages}
				</div>
			</div>
			<div class="write" data-chat="${data._id}">
				<input type="text" class="write-chat" data-chat="${data._id}">
				<div class="icons">
					<a href="#" class="icon-chat" data-chat="${data._id}">
						<i class="fa fa-smile-o"></i>
					</a>
					<label for="image-chat-${data._id}">
						<input type="file" id="image-chat-${data._id}" name="my-image-chat" class="image-chat" data-chat="${data._id}">
						<i class="fa fa-photo"></i>
					</label>
					<label for="attach-chat-${data._id}">
						<input type="file" id="attach-chat-${data._id}" name="my-attach-chat" class="attach-chat" data-chat="${data._id}">
						<i class="fa fa-paperclip"></i>
					</label>
					<a href="#streamModal_${data._id}" id="video-chat-${data._id}" class="video-chat" data-chat="${data._id}"
						data-toggle="modal">
						<i class="fa fa-video-camera"></i>
					</a>
					<input type="hidden" id="peer-id" value="">
				</div>
			</div>
		</div>
	`;
}

function rightSideChatGroupWithData(data, currentUserId) {
	const messages = getMessagesRightSide(data.messages, currentUserId)
	return `
		<div class="right tab-pane" data-chat="${data._id}"
		id="to_${data._id}">
			<div class="top">
				<span>To: <span class="name">${data.name}</span></span>
				<span class="chat-menu-right">
					<a href="#attachsModal_${data._id}" class="show-attachs" data-toggle="modal">
						Tệp đính kèm <i class="fa fa-paperclip"></i>
					</a>
				</span>
				<span class="chat-menu-right">
					<a href="javascript:void(0)">&nbsp;</a>
				</span>
				<span class="chat-menu-right">
					<a href="#imagesModal_${data._id}" class="show-images" data-toggle="modal">
						Hình ảnh <i class="fa fa-photo"></i>
					</a>
				</span>
				<span class="chat-menu-right">
					<a href="javascript:void(0)">&nbsp;</a>
				</span>
				<span class="chat-menu-right">
					<a href="#membersModal_${data._id}" class="show-number-members" data-toggle="modal">
						<span class="number-members">${data.userAmount}</span>
						<i class="fa fa-users"></i>
					</a>
				</span>
				<span class="chat-menu-right">
					<a href="javascript:void(0)">&nbsp;</a>
				</span>
				<span class="chat-menu-right">
					<a href="javascript:void(0)">
						<span class="number-messages">${data.messageAmount}</span>
						<i class="fa fa-comments-o"></i>
					</a>
				</span>
			</div>
			<div class="content-chat">
				<div class="chat" data-chat="${data._id}">
					${messages}
				</div>
			</div>
			<div class="write" data-chat="${data._id}">
				<input type="text" class="write-chat input-chat-group" data-chat="${data._id}">
				<div class="icons">
					<a href="#" class="icon-chat" data-chat="${data._id}"><i class="fa fa-smile-o"></i></a>
					<label for="image-chat-${data._id}">
						<input type="file" id="image-chat-${data._id}" name="my-image-chat"
							class="image-chat input-chat-group" data-chat="${data._id}" accept="image/*">
						<i class="fa fa-photo"></i>
					</label>
					<label for="attach-chat-${data._id}">
						<input type="file" id="attach-chat-${data._id}" name="my-attach-chat"
							class="attach-chat input-chat-group" data-chat="${data._id}">
						<i class="fa fa-paperclip"></i>
					</label>
					<a href="#streamModal_${data._id}" id="video-chat-${data._id}" class="video-chat input-chat-group"
						data-chat="${data._id}" data-toggle="modal">
						<i class="fa fa-video-camera"></i>
					</a>
					<input type="hidden" id="peer-id" value="">
				</div>
			</div>
		</div>
	`;
}

function modalImageWithData(data) {
	let allImages = '';
	data.messages.map(message => {
		if(message.messageType === 'image'){
			allImages += `
				<img src="data:${message.file.contentType}; base64, ${bufferToBase64(message.file.data.data)}" alt="Modal Conversation" />
			`;
		}
	});
	return `
		<div class="modal fade" id="imagesModal_${data._id}" role="dialog">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">Tất cả các hình ảnh trong cuộc trò chuyện.</h4>
					</div>
					<div class="modal-body">
						<div class="all-images" style="visibility: hidden;">
							${allImages}
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
}

function modalAttachmentWithData(data) {
	let allAttachment = '';
	data.messages.map(message => {
		if(message.messageType === 'file'){
			allAttachment += `
				<li>
					<a href="data:${message.file.contentType}; base64, ${bufferToBase64(message.file.data.data)}" 
					download="${message.file.fileName}">
						${message.file.fileName}
					</a>
				</li>
			`;
		}
	})
	return `
		<div class="modal fade" id="attachsModal_${data._id}" role="dialog">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">Tất cả các file trong cuộc trò chuyện.</h4>
					</div>
					<div class="modal-body">
						<ul class="list-attachs">
							${allAttachment}
						</ul>
					</div>
				</div>
			</div>
		</div>
	`;
}

function modalMemberWithData(data, currentUserId) {
	const members = getMembersGroup(data.members, data._id, currentUserId);
	return `
		<div class="modal fade" id="membersModal_${data._id}" role="dialog">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">Danh sách các thành viên trong nhóm.</h4>
					</div>
					<div class="modal-body">
						<ul class="list-members">
							${members}
						</ul>
					</div>
				</div>
			</div>
		</div>
	`;
}

$(document).ready(function() {
	$('#read-more-all-chat').click(function() {
		let skipNumberGroup = $('#all-chat ul li.group-chat').length;
		let skipNumberPerson = $('#all-chat ul li:not(.group-chat)').length;

		$('.read-more-all-chat-loader').css('display', 'block');
		$(this).css('display', 'none');

		$.get(`/message/read-more-conversations?skip_group=${skipNumberGroup}&skip_person=${skipNumberPerson}`, function(data){
			const { moreConversations, moreGroupWithMembers } = data;
			console.log(data);
			if(!moreConversations.length){
				$('.read-more-all-chat').html('');
				return;
			}

			// Init variable
			const currentUserId = $('#dropdown-navbar-user').data('uid');
			const allAttachmentModal = $('.all-attachment-modal');
			const allImageModal = $('.all-image-modal');
			const allMemberModal = $('.all-members-modal');
			const allChat = $('#all-chat ul');
			const screenChat = $('#screen-chat');

			let rightSideChat = '';
			let imageModal = '';
			let attachmentModal = '';
			let memberModal = '';

			console.time('time')
			moreConversations.map(conversation => {
				if(conversation.members){ // Is Chat Group
					allChat.append(leftSideChatGroupWithData(conversation));
					rightSideChat += rightSideChatGroupWithData(conversation, currentUserId);
				} else{ // Is Chat Personal
					allChat.append(leftSideChatPersonalWithData(conversation));
					rightSideChat += rightSideChatPersonalWithData(conversation, currentUserId);
				}
				imageModal += modalImageWithData(conversation)
				attachmentModal += modalAttachmentWithData(conversation)
			})
			moreGroupWithMembers.map(group => {
				memberModal += modalMemberWithData(group, currentUserId);
			})

			screenChat.append(rightSideChat);
			allAttachmentModal.append(attachmentModal);
			allImageModal.append(imageModal);
			allMemberModal.append(memberModal);		

			changeScreenChat();
			checkUserOnline();
			console.timeEnd('time')

			$('.read-more-all-chat-loader').css('display', 'none');
			$(this).css('display', 'block');
		}.bind(this));
	})
})
