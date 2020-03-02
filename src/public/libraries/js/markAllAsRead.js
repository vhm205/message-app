function ajaxMarkAllAsRead(targetUsers) {
	$.ajax({
		type: "patch",
		url: "/notification/mark-all-as-read",
		data: { targetUsers }
	}).done(res => {
		if(res){
			// Loop targetUsers[], find data-uid equal to the uid
			// Then remove class notify-readed-false
			targetUsers.map(function(uid) {
				$('.noti_content').find(`[data-uid=${uid}]`).removeClass('notify-readed-false')
				$('.list-notification > li').find(`[data-uid=${uid}]`).removeClass('notify-readed-false')
			})

			// Decrease notify popup
			decreaseNumberQueueContact('noti_counter', false, targetUsers.length)
		}
	}).fail(err => console.log(err))
}

function markAllAsRead(classContainer, classChild) {
	let targetUsers = [];

	// Find all classes named is classChild
	// Then push data-uid into targetUsers[]
	$(classContainer).find(classChild).each(function(_, notification){
		targetUsers = [...targetUsers, $(notification).data('uid')]
	});

	if(!targetUsers.length) return;

	// Call ajax mark all notifications as read
	ajaxMarkAllAsRead(targetUsers)
}

$(document).ready(function() {
	$('#popup-mark-all-as-read').click(markAllAsRead.bind(null, '.noti_content', '.notify-readed-false'))

	$('#modal-mark-all-as-read').click(markAllAsRead.bind(null, '.list-notification > li', '.notify-readed-false'))
})
