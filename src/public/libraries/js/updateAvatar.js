let userInfo = Object.create(null)
let userAvatar = null
let originAvatar = null

function updateUserProfile() {
    $('#input-change-avatar').on('change', function() {
        const fileData = $(this).prop('files')[0]
        const typesAccept = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
        const limit = 1048576

        if($.inArray(fileData.type, typesAccept) === -1){
            alertify.notify('Kiểu file không hợp lệ, chỉ chấp nhận file có định dạng png, jpg, jpeg, gif', 'error', 8)
            $(this).val(null)
            return
        }

        if(fileData.size > limit){
            alertify.notify('Ảnh upload tối đa 1MB', 'error', 5)
            $(this).val(null)
            return
        }
      
        if(typeof FileReader === undefined){
            alertify.notify('Trình duyệt của bạn không hỗ trợ FileReader', 'warning', 5)
            return
        }

        const imagePreview = $('#image-edit-profile')
        imagePreview.empty()

		const fileReader = new FileReader()
        fileReader.onload = function(el) {
            $('<img>', {
                'src': el.target.result,
                'id': 'user-modal-avatar',
                'class': 'avatar img-circle',
                'alt': 'avatar'
            }).appendTo(imagePreview)
        }
		fileReader.readAsDataURL(fileData)
		
		const frmData = new FormData()
		frmData.append('avatar', fileData)
		userAvatar = frmData
	})
	
	originAvatar = $('#user-modal-avatar').attr('src')
	
	$('#input-update-user').click(function() {
		let username = $('#input-username').val()
		let address  = $('#input-address').val()
		let phone 	 = $('#input-phone').val()
		let gender 	 = $("input[name='gender']:checked").val()

		username ? userInfo.username = username : delete userInfo.username
		address  ? userInfo.address  = address 	: delete userInfo.address
		phone 	 ? userInfo.phone 	 = phone 	: delete userInfo.phone
		gender 	 ? userInfo.gender 	 = gender 	: delete userInfo.gender

		if(!$.isEmptyObject(userInfo) && userAvatar){
			$.ajax({
				url: '/user/update-avatar',
				type: 'patch',
				cache: false,
				contentType: false,
				processData: false,
				data: userAvatar
			}).done(res => {
				// Display alert update success
				$('.response-update-success').find('span').text(res.message).parent().css('display', 'block')
				$('.response-update-error').css('display', 'none')

				// Update origin avatar to avatar new
				$('#avatar-navbar').attr('src', res.imageUrl)
				originAvatar = res.imageUrl

				$('#input-cancel-user').click()
			}).fail(err => {
				// Display alert update error
				$('.response-update-error').find('span').text(err.responseText).parent().css('display', 'block')
				$('.response-update-success').css('display', 'none')

				$('#input-cancel-user').click()
			})
		}		
	})

	$('#input-cancel-user').click(function() {
		$('#user-modal-avatar').attr('src', originAvatar)
		userInfo = Object.create(null)
		userAvatar = null
		
		$('#btn-close-update-user').click()
	})

	$('#input-cancel-user-2').click(function() {
		$('#btn-close-update-user').click()
	})
}

$(document).ready(function() {
	updateUserProfile()
})
