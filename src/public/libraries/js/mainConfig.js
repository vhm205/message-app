/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */

const socket = io();

function convertToEmoij() {
	$(".convert-emoji").each(function() {
		const original = $(this).html();
		const converted = emojione.toImage(original);
		$(this).html(converted);
	});
}

function bufferToBase64(buffer) {
	return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

function getLastIndex(arr){
	if(!arr.length) return [];
	return arr[arr.length - 1];
}

function convertTimstampToHumanTime(timestamp) {
	if(!timestamp) return '';
	return moment(timestamp).locale('vi').startOf('seconds').fromNow();
}

function nineScrollLeft() {
	const leftside = $('.left');
	leftside.niceScroll({
		smoothscroll: true,
		horizrailenabled: false,
		cursorcolor: '#ECECEC',
		cursorwidth: '10px',
		scrollspeed: 50
	});
	leftside.getNiceScroll().resize();
	leftside.scrollTop(leftside[0].scrollHeight);
}

function nineScrollRight(chatId) {
	const chatContent = $(`.right .chat[data-chat=${chatId}]`)
	chatContent.niceScroll({
		smoothscroll: true,
		horizrailenabled: false,
		cursorcolor: '#ECECEC',
		cursorwidth: '10px',
		scrollspeed: 50
	});
	chatContent.getNiceScroll().resize();
	chatContent.scrollTop(chatContent[0].scrollHeight);	
}

function enableEmojioneArea(chatId) {
	const writeChat = $(`.write-chat[data-chat="${chatId}"]`)
	writeChat.emojioneArea({
		standalone: false,
		pickerPosition: 'top',
		filtersPosition: 'bottom',
		tones: false,
		autocomplete: false,
		inline: true,
		hidePickerOnBlur: true,
		search: false,
		shortnames: false,
		events: {
			keyup: function(editor, event) {
				writeChat.val(this.getText());

				// Is chating
				typingOn(chatId);

				if(event.keyCode === 13){
					setTimeout(() => this.setText(''));
				}
			},
			focus: function(){
				$(`.person[data-chat=${chatId}]`).find('.time, .preview').removeClass('active');
				chatText(chatId);

				// After 3 seconds, off typing
				setTimeout(() => {
					typingOff(chatId);
				}, 3000);
			},
			blur: function() {
				typingOff(chatId);
			}
		},
	});
	$('.icon-chat').on('click', function(event) {
		event.preventDefault();
		$('.emojionearea-button').click();
		$('.emojionearea-editor').focus();
	});
}

function spinLoaded() {
  $('.loader').css('display', 'none');
}

function spinLoading() {
  $('.loader').css('display', 'block');
}

function ajaxLoading() {
  $('body, html')
    .ajaxStart(function() {
		spinLoading();
    })
    .ajaxStop(function() {
		spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $('.main-content').off('click').on('click', function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
	$('.show-images').off('click').on('click', function(e){
		e.preventDefault()

		let modalImageId = $($(this).attr('href'))
		let originHtml = modalImageId.find('.modal-body').html()

		let countRows = Math.ceil(modalImageId.find('.all-images img').length / layoutNumber);
		let layoutStr = new Array(countRows).fill(layoutNumber).join("");

		modalImageId.find('.all-images').photosetGrid({
			highresLinks: true,
			rel: 'withhearts-gallery',
			gutter: '2px',
			layout: layoutStr,
			onComplete: function() {
				modalImageId.find('.all-images').css({
					'visibility': 'visible'
				});
				modalImageId.find('.all-images a').colorbox({
					photo: true,
					scalePhotos: true,
					maxHeight: '90%',
					maxWidth: '90%'
				});
			}
		});

		modalImageId.on('hidden.bs.modal', function () {
			$(this).find('.modal-body').html(originHtml)
		})
	})
}

function addFriendsToGroup() {
  $(`#group-chat-friends .add-user-to-group`).off('click').on('click', function(){
	const uid = $(this).data('uid');
	let isExists = false;

	// Check is exists
	$('#friends-added li').each((_, value) => {
		if(uid === $(value).data('uid')) isExists = true;
	})	
	if(isExists){
		alertify.notify('User đã tồn tại trong danh sách', 'error', 5);
		return;
	}

	$(this).remove();
	const divUser = $(`#group-chat-friends div[data-uid=${uid}]`);
	const html = divUser.html();

	$('#friends-added').append(html);
	$('#groupChatModal .list-user-added').show();
	divUser.remove();
  })
}

function cancelCreateGroup() {
  	$('#cancel-group-chat').on('click', function() {
		$('#groupChatModal .list-user-added').hide();
		const userAdded = $('#friends-added>li');
		if (userAdded.length) {
			userAdded.each(function() {
				$(this).remove();
			});
		}
  	});
}

function flashMasterNotify() {
  const notify = $('.master-success-message').text()
  if(notify.length){
    alertify.notify(notify, 'success', 5)
  }
}

function loadMoreConversation(moreConversations, moreGroupWithMembers) {
	// Init variable
	const currentUserId = $('#dropdown-navbar-user').data('uid');
	const allAttachmentModal = $('.all-attachment-modal');
	const allImageModal = $('.all-image-modal');
	const allMemberModal = $('.all-members-modal');
	const allChat = $('#all-chat ul');
	const userChat = $('#user-chat ul');
	const groupChat = $('#group-chat ul');
	const screenChat = $('#screen-chat');

	let rightSideChat = '';
	let imageModal = '';
	let attachmentModal = '';
	let memberModal = '';

	// Load more conversation
	moreConversations.map(conversation => {
		if(conversation.members){ // Is Chat Group
			allChat.append(leftSideChatGroupWithData(conversation));
			groupChat.append(leftSideChatGroupWithData(conversation));
			rightSideChat += rightSideChatGroupWithData(conversation, currentUserId);
		} else{ // Is Chat Personal
			allChat.append(leftSideChatPersonalWithData(conversation));
			userChat.append(leftSideChatPersonalWithData(conversation));
			rightSideChat += rightSideChatPersonalWithData(conversation, currentUserId);
		}
		imageModal += modalImageWithData(conversation);
		attachmentModal += modalAttachmentWithData(conversation);
	})
	// Load more member modal in chat group
	moreGroupWithMembers.map(group => {
		memberModal += modalMemberWithData(group, currentUserId);
	})

	screenChat.append(rightSideChat);
	allAttachmentModal.append(attachmentModal);
	allImageModal.append(imageModal);
	allMemberModal.append(memberModal);
}

function changeTypeChat() {
	$('#select-type-chat').change(function() {
		$(this).children(':selected').tab('show')

		if($(this).val() === 'user-chat'){
			$('.create-group-chat').hide()
		} else{
			$('.create-group-chat').show()
		}
	})
}

function changeScreenChat() {
	$('.room-chat').off('click').on('click', function(e){
		const chatId = $(this).find('li').data('chat')

		$('.room-chat li').removeClass('active')
		$(`.person[data-chat=${chatId}]`).addClass('active')
		$(this).tab('show')

		// Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
		// Tham số chỉ được phép trong khoảng từ 1 đến 5
		gridPhotos(5);
		// Cấu hình thanh cuộn chat khi click vào user bên leftSide
		nineScrollRight(chatId);
		// Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
		enableEmojioneArea(chatId);
		// Chat image message
		chatImage(chatId);
		// Chat attachment message
		chatAttachment(chatId);
		// Read more message
		readMoreMessage(chatId);
	})
}

function checkUserOnline() {
	const allContacts = $('#all-chat .person:not(.group-chat)');
	const listUsersId = Array.from(allContacts).map((value) => $(value).data('chat'));
	socket.emit('check-online', { listUsersId })
}

socket.on('response-check-online', response => {
	response.listUser.map(id => {
		$(`.person[data-chat=${id}] .dot`).css('background-color', '#0ce6f1')
	})
})

socket.on('response-check-offline', response => {
	$(`.person[data-chat=${response.currentUserId}] .dot`).css('background-color', '#bbbbbb')
})

$(document).ready(function() {
	checkUserOnline();
	// Hide số thông báo trên đầu icon mở modal contact
	showModalContacts();

	// Bật tắt popup notification
	configNotification();

	// Cấu hình thanh cuộn
	nineScrollLeft();

	// Icon loading khi chạy ajax
	ajaxLoading();

	// Action hủy việc tạo nhóm trò chuyện
	cancelCreateGroup();

	// Convert emoji unicode to image
	convertToEmoij();

	flashMasterNotify();

	changeTypeChat();
	
	changeScreenChat();

	// Active first contact
	$('#all-chat a:first-child li').trigger('click')

	// $(`.right .chat[data-chat=${conversationId}]`)
});
