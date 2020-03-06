let userInfo = Object.create(null)
let userAvatar = null
let originInfo = Object.create(null)
let originAvatar = null
let userUpdatePassword = {}

function callLogout() {
	let timeInterval;
	Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 10000,
		timerProgressBar: true,
		onBeforeOpen: () => {
			//Swal.showLoading()
			timeInterval = setInterval(() => {
				Swal.getContent().querySelector('strong').textContent = Math.ceil(Swal.getTimerLeft() / 1000)
			}, 1000)
		},
		onOpen: toast => {
		  toast.addEventListener('mouseenter', Swal.stopTimer)
		  toast.addEventListener('mouseleave', Swal.resumeTimer)
		},
		onClose: () => {
			clearInterval(timeInterval)
		}
	}).fire({
		icon: 'success',
		html: '<h5>Change password successfully<br />Time left: <strong></strong></h5>'
	}).then(_ => {
		$.get('/logout', () => location.reload())
	})
}

function callUpdateUserAvatar() {
	$.ajax({
		url: '/user/update-avatar',
		type: 'patch',
		cache: false,
		contentType: false,
		processData: false,
		data: userAvatar
	}).done(res => {
		// Alert message update success
		alertify.notify('Cập nhật ảnh đại diện thành công!', 'success', 5)
		$('.response-update-error').css('display', 'none')

		// Update origin avatar to avatar new
		$('#avatar-navbar').attr('src', res.imageUrl)
		originAvatar = res.imageUrl

		// Reset avatar modal
		$('#user-modal-avatar').attr('src', originAvatar)
		userAvatar = null
	}).fail(err => {
		// Display alert update error
		$('.response-update-error').find('span').text(err.responseText).parent().css('display', 'block')

		$('#input-reset-user').trigger('click')
	})
}

function callUpdateUserInfo() {
	$.ajax({
		url: '/user/update-info',
		type: 'patch',
		data: userInfo
	}).done(res => {
		// Update username info on Navbar
		$('#navbar-username').text(userInfo.username)
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

		$('#input-reset-user').trigger('click')
	})
}

function callUpdateUserPassword() {
	$.ajax({
		url: '/user/update-password',
		type: 'patch',
		data: userUpdatePassword
	}).done(res => {
		// Display alert update success
		$('.response-update-password-success').find('span').html(res.message).parent().css('display', 'block')
		$('.response-update-password-error').css('display', 'none')

		$('#input-reset-user-2').trigger('click')
		callLogout()
	}).fail(err => {
		// Split error array
		const errorArr = err.responseText.replace(/[\[\]&]+/g, '').replace(/[\"&]+/g, '').split(',')
		const errText = errorArr.map(e => `${e}<br />`)

		// Display alert update error
		$('.response-update-password-error').find('span').html(errText).parent().css('display', 'block')
		$('.response-update-password-success').css('display', 'none')

		$('#input-reset-user-2').trigger('click')
	})
}

function updateUserProfile() {
	// Create origin value
	originAvatar = $('#user-modal-avatar').attr('src')
	originInfo = {
		username : $('#input-username').val(),
		address  : $('#input-address').val(),
		phone 	 : $('#input-phone').val(),
		gender 	 : $("input[name='gender']:checked").val()
	}

    $('#input-change-avatar').on('change', function() {
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
      
        if(typeof FileReader === undefined){
            alertify.notify('Trình duyệt của bạn không hỗ trợ FileReader', 'warning', 5)
            return;
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

	$('#input-current-password').bind('change', function() {
		let currentPassword = $(this).val()

		let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/

		if(!regex.test(currentPassword)){
			alertify.notify('Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ số và ký tự đặc biệt', 'error', 5)
			$(this).focus();
			$(this).val(null);
			delete userUpdatePassword.currentPassword;
			return;
		}

		userUpdatePassword.currentPassword = currentPassword
	})

	$('#input-new-password').bind('change', function() {
		let newPassword = $(this).val()

		let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/

		if(!regex.test(newPassword)){
			alertify.notify('Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ số và ký tự đặc biệt', 'error', 5)
			$(this).focus();
			$(this).val(null);
			delete userUpdatePassword.newPassword;
			return;
		}

		userUpdatePassword.newPassword = newPassword
	})

	$('#input-confirm-password').bind('change', function() {
		let confirmNewPassword = $(this).val()

		if(!userUpdatePassword.newPassword){
			alertify.notify('Bạn chưa nhập mật khẩu mới', 'error', 5)
			$('#input-new-password').focus();
			$(this).val(null)
			delete userUpdatePassword.confirmNewPassword;
			return;
		}

		if(confirmNewPassword !== userUpdatePassword.newPassword){
			alertify.notify('Mật khẩu không trùng khớp', 'error', 5)
			$(this).focus();
			$(this).val(null)
			delete userUpdatePassword.confirmNewPassword;
			return;
		}

		userUpdatePassword.confirmNewPassword = confirmNewPassword
	})
	
	$('#input-update-password').click(function() {
		if(!userUpdatePassword.hasOwnProperty('currentPassword') ||
			!userUpdatePassword.hasOwnProperty('newPassword') ||
			!userUpdatePassword.hasOwnProperty('confirmNewPassword')){
			alertify.notify('Bạn cần nhập đầy đủ tất cả các trường', 'error', 5)
			return;
		}

		Swal.fire({
			title: 'Bạn có chắc muốn đổi mật khẩu?',
			text: 'Nhớ ghi mật khẩu ra giấy kẻo quên <3',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#2ECC71',
			cancelButtonColor: '#ff7675',
			confirmButtonText: 'Chấp nhận',
			cancelButtonText: 'Hủy'
		}).then(result => {
			if (!result.value) {
				$('#input-reset-user-2').click()
				return;
			}
			callUpdateUserPassword();
		})
	})

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
		userAvatar = null

		userInfo = Object.create(null)
		$('#input-username').val(originInfo.username)
		$('#input-address').val(originInfo.address)
		$('#input-phone').val(originInfo.phone)
		$(`input[value='${originInfo.gender}']`).trigger('click')
	})

	$('#input-reset-user-2').click(function() {
		userUpdatePassword = {}
	})

	$('#input-cancel, #input-cancel-2').click(function() {
		$('#btn-close-update-user').trigger('click')
	})
}

$(document).ready(function() {
	updateUserProfile()
})
