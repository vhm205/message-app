// --------------------- Template Clean -------------------------

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
			<div class="chat" data-chat="${conversation.id}">
				<!-- Spinner Load more -->
				<div class="read-more-message">
					<div class="read-more-message-loader">
						<div class="sk-wave">
							<div class="sk-wave-rect"></div>
							<div class="sk-wave-rect"></div>
							<div class="sk-wave-rect"></div>
							<div class="sk-wave-rect"></div>
						</div>
					</div>
				</div>
			</div>
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
				<a href="javascript:void(0)" id="video-chat-${conversation.id}" class="video-chat" data-chat="${conversation.id}">
					<i class="fa fa-video-camera"></i>
				</a>
			</div>
		</div>
	</div>
	`;
}

function templateRightSideChatGroup(conversation, currentUserId) {
	return `
	<div class="right tab-pane" data-chat="${conversation.id}" id="to_${conversation.id}">
		<div class="top">
			<span>To: <span class="name">${conversation.groupname}</span></span>
			${(conversation.adminId !== currentUserId) ? (
				`<span class="chat-menu-right">
					<a href="javascript:void(0)" class="user-leave-group" data-group="${conversation.id}">
						Rời khỏi nhóm
						<i class="fa fa-times"></i>
					</a>
				</span>
				<span class="chat-menu-right">
					<a href="javascript:void(0)">&nbsp;</a>
				</span>`
			) : ''}
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
			<div class="chat" data-chat="${conversation.id}">
				<!-- Spinner Load more -->
				<div class="read-more-message">
					<div class="read-more-message-loader">
						<div class="sk-wave">
							<div class="sk-wave-rect"></div>
							<div class="sk-wave-rect"></div>
							<div class="sk-wave-rect"></div>
							<div class="sk-wave-rect"></div>
						</div>
					</div>
				</div>
			</div>
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

// --------------------- Template With Data -------------------------

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

function getMembersGroup(members, adminId, currentUserId) {
	let membersHtml = '';
	members.map(member => {		
		membersHtml += `
			<li class="_membersList" data-uid="${member._id}">
				<div class="user-avatar">
					<img src="./libraries/images/users/${member.avatar}" alt="Thumb Group">
				</div>
				${(member._id === currentUserId && member._id === adminId) ? (
					`<div class="user-name user-admin">
						${member.username}
						<div>(Bạn là Admin)</div>
					</div>`
				) : ((member._id === currentUserId && member._id !== adminId) ? (
					`<div class="user-name">
						${member.username}
						<div>(Bạn)</div>
					</div>`
				) : (member._id === adminId) ? (
					member.status ? (
						`<div class="user-name user-admin">
						${member.username}
							<div>(Admin)</div>
						</div>
						<br>
						<div class="user-talk" data-uid="${member._id}">
							Trò chuyện
						</div>`
					) : (
						`<div class="user-name user-admin">
						${member.username}
							<div>(Admin)</div>
							<div>(Chưa kết bạn)</div>
						</div>`
					)
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
	return membersHtml;
}

/// For response real-time create new group chat (Only one-time use)
function getMembersGroupFake(members, adminId, currentUserId) {
	let membersHtml = '';
	members.map(member => {		
		membersHtml += `
			<li class="_membersList" data-uid="${member._id}">
				<div class="user-avatar">
					<img src="./libraries/images/users/${member.avatar}" alt="Thumb Group">
				</div>
				${((member._id === currentUserId && member._id !== adminId) ? (
					`<div class="user-name">
						${member.username}
						<div>(Bạn)</div>
					</div>`
				) : (member._id === adminId) ? (
					`<div class="user-name user-admin">
						${member.username}
						<div>(Admin)</div>
					</div>`
				) : (
					`<div class="user-name">
						${member.username}
					</div>`
				))}
			</li>`;
	});
	return membersHtml;
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
					<!-- Spinner Load more -->
					<div class="read-more-message">
						<div class="read-more-message-loader">
							<div class="sk-wave">
								<div class="sk-wave-rect"></div>
								<div class="sk-wave-rect"></div>
								<div class="sk-wave-rect"></div>
								<div class="sk-wave-rect"></div>
							</div>
						</div>
					</div>
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
					<a href="javascript:void(0)" id="video-chat-${data._id}" class="video-chat" data-chat="${data._id}">
						<i class="fa fa-video-camera"></i>
					</a>
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
				${(data.userId !== currentUserId) ? (
					`<span class="chat-menu-right">
						<a href="javascript:void(0)" class="user-leave-group" data-group="${data._id}">
							Rời khỏi nhóm
							<i class="fa fa-times"></i>
						</a>
					</span>
					<span class="chat-menu-right">
						<a href="javascript:void(0)">&nbsp;</a>
					</span>`
				) : ''}
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
					<!-- Spinner Load more -->
					<div class="read-more-message">
						<div class="read-more-message-loader">
							<div class="sk-wave">
								<div class="sk-wave-rect"></div>
								<div class="sk-wave-rect"></div>
								<div class="sk-wave-rect"></div>
								<div class="sk-wave-rect"></div>
							</div>
						</div>
					</div>
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
	const members = getMembersGroup(data.members, data.userId, currentUserId);
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

/// For response real-time create new group chat (Only one-time use)
function modalMemberWithDataFake(data, currentUserId) {
	const members = getMembersGroupFake(data.members, data.userId, currentUserId);
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

function rightSideGroupMessages(messages, currentUserId) {
	let messagesHtml = '';
	messages.map(message => {
		switch (message.messageType) {
			case 'text':
				messagesHtml += `
					<div class="bubble convert-emoji ${message.senderId == currentUserId ? "me" : "you"}" data-mess-id="${message._id}">
						<img src="./libraries/images/users/${message.sender.avatar}" class="avatar-small" title="${message.sender.name}" />
						<span title="${new Date(message.createdAt).toLocaleString()}">
							${message.text}
						</span>
					</div>
				`;
				break;
			case 'image':
				messagesHtml += `
					<div class="bubble bubble-image-file ${message.senderId == currentUserId ? "me" : "you"}" data-mess-id="${message._id}">
						<img src="./libraries/images/users/${message.sender.avatar}" class="avatar-small" title="${message.sender.name}" />
						<img src="data:${message.file.contentType}; base64, ${bufferToBase64(message.file.data)}" class="show-image-chat" title="${new Date(message.createdAt).toLocaleString()}">
					</div>
				`;
				break;
			case 'file':
				messagesHtml += `
					<div class="bubble bubble-attach-file ${message.senderId == currentUserId ? "me" : "you"}" data-mess-id="${message._id}">
						<img src="./libraries/images/users/${message.sender.avatar}" class="avatar-small" title="${message.sender.name}" />
						<a href="data:${message.file.contentType}; base64, ${bufferToBase64(message.file.data)}"
							download="${message.file.fileName}"
							title="${new Date(message.createdAt).toLocaleString()}">
							${message.file.fileName}
						</a>
					</div>
				`;
				break;
		}
	})
	return messagesHtml;
}

function rightSidePersonalMessages(messages, currentUserId) {
	let messagesHtml = '';
	messages.map(message => {
		switch (message.messageType) {
			case 'text':
				messagesHtml += `
					<div class="bubble convert-emoji ${message.senderId == currentUserId ? "me" : "you"}" data-mess-id="${message._id}">
						<span title="${new Date(message.createdAt).toLocaleString()}">
							${message.text}
						</span>
					</div>
				`;
				break;
			case 'image':
				messagesHtml += `
					<div class="bubble bubble-image-file ${message.senderId == currentUserId ? "me" : "you"}" data-mess-id="${message._id}">
						<img src="data:${message.file.contentType}; base64, ${bufferToBase64(message.file.data)}" class="show-image-chat" title="${new Date(message.createdAt).toLocaleString()}">
					</div>
				`;
				break;
			case 'file':
				messagesHtml += `
					<div class="bubble bubble-attach-file ${message.senderId == currentUserId ? "me" : "you"}" data-mess-id="${message._id}">
						<a href="data:${message.file.contentType}; base64, ${bufferToBase64(message.file.data)}"
							download="${message.file.fileName}"
							title="${new Date(message.createdAt).toLocaleString()}">
							${message.file.fileName}
						</a>
					</div>
				`;
				break;
		}
	})
	return messagesHtml;
}
