let userInfo = Object.create(null)
let userAvatar = null
let originInfo = Object.create(null)
let originAvatar = null

function callUpdateUserAvatar() {
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

		// Set again avatar modal
		$('#user-modal-avatar').attr('src', originAvatar)
		userAvatar = null
	}).fail(err => {
		// Display alert update error
		$('.response-update-error').find('span').text(err.responseText).parent().css('display', 'block')
		$('.response-update-success').css('display', 'none')

		$('#input-reset-user').click()
	})
}

function callUpdateUserInfo() {
	$.ajax({
		url: '/user/update-info',
		type: 'patch',
		data: userInfo
	}).done(res => {
		// Update username info on Navbar And Close Modal
		$('#navbar-username').text(userInfo.username)
		$('#btn-close-update-user').click()
		$('.response-update-error').css('display', 'none')

		alertify.notify(res.message, 'success', 5)

		// Reset all variable
		userInfo = Object.create(null)
		originInfo = {
			username : $('#input-username').val(),
			address  : $('#input-address').val(),
			phone 	 : $('#input-phone').val(),
			gender 	 : $("input[name='gender']:checked").val()
		}
	}).fail(err => {
		// Split error array
		const errorArr = err.responseText.replace(/[\[\]&]+/g, '').replace(/[\"&]+/g, '').split(',')
		const errText = errorArr.map(e => `${e}<br />`)

		// Display alert update error
		$('.response-update-error').find('span').html(errText).parent().css('display', 'block')
		$('.response-update-success').css('display', 'none')

		$('#input-reset-user').click()
	})
}

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
		
		// Create preview Avatar
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
	
	// Create origin value
	originAvatar = $('#user-modal-avatar').attr('src')
	originInfo = {
		username : $('#input-username').val(),
		address  : $('#input-address').val(),
		phone 	 : $('#input-phone').val(),
		gender 	 : $("input[name='gender']:checked").val()
	}

	$('#input-update-user').click(function() {
		let username = $('#input-username').val()
		let address  = $('#input-address').val()
		let phone 	 = $('#input-phone').val()
		let gender 	 = $("input[name='gender']:checked").val()

		// Check if input is non-empty, then assign value to userInfo
		// Else delete property
		username ? userInfo.username = username : delete userInfo.username
		address  ? userInfo.address  = address 	: delete userInfo.address
		phone 	 ? userInfo.phone 	 = phone 	: delete userInfo.phone
		gender 	 ? userInfo.gender 	 = gender 	: delete userInfo.gender

		// Check if key & value of userInfo are different from originInfo
		for (const [k1, v1] of Object.entries(userInfo)) {
			for (const [k2, v2] of Object.entries(originInfo)) {
				if(k1 === k2 && v1 === v2){
					delete userInfo[k1]
				}
			}
		}

		if(userAvatar){
			callUpdateUserAvatar()
		}

		if(!$.isEmptyObject(userInfo)){
			callUpdateUserInfo()
		}
	})

	$('#input-reset-user').click(function() {
		$('#user-modal-avatar').attr('src', originAvatar)
		userInfo = Object.create(null)
		userAvatar = null
	})


	$('#input-cancel, #input-cancel-2').click(function() {
		$('#btn-close-update-user').click()
	})
}

$(document).ready(function() {
	updateUserProfile()
})
