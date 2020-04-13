function chatImage(chatId) {
	$(`#image-chat-${chatId}`).off('change').on('change', function(e){
		const fileData = $(this).prop('files')[0]
		const typesAccept = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
		const limit = 1048576

		if($.inArray(fileData.type, typesAccept) === -1){
				alertify.notify('Kiểu file không hợp lệ, chỉ chấp nhận file có định dạng png, jpg, jpeg, gif', 'error', 8)
				$(this).val(null)
				return;
		}

		if(fileData.size > limit){
				alertify.notify('Ảnh upload tối đa 1MB', 'error', 5)
				$(this).val(null)
				return;
		}

		const frmData = new FormData()
		frmData.append('receiverId', chatId)
		frmData.append('image', fileData)
		frmData.append('isChatGroup', $(this).hasClass('input-chat-group') ? true : false)
		
		$.ajax({
			type: "post",
			url: "/message/add-new-image",
			data: frmData,
			cache: false,
			processData: false,
			contentType: false
		}).done(data => {
			console.log(data);
		}).fail(err => {
			alertify.notify(err.responseText, 'error', 5)
		})
	})
}
