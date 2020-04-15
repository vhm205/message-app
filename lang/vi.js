export const transValidation = {
    email_incorrect: 'Email không hợp lệ!!',
    gender_incorrect: 'Oops! Bạn có vấn đề về giới tính',
    password_incorrect: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ số và ký tự đặc biệt',
    password_confirm_incorrect: 'Mật khẩu không trùng khớp',
    username_update: 'Username giới hạn 3 - 20 ký tự (không bao gồm các ký tự đặc biệt)',
    gender_update: 'Oops! Bạn có vấn đề về giới tính',
    address_update: 'Địa chỉ giới hạn 3 - 30 ký tự',
    phone_update: 'Số điện thoại giới hạn 10 - 11 ký tự và bắt đầu bằng số 0',
		keyword_search_empty: 'Nhập ít nhất 3 ký tự',
		chat_message_incorrect: 'Tin nhắn không được trống và tối đa 500 ký tự'
}

export const transErrors = {
    email_is_existed: 'Email này đã được sử dụng',
    email_is_removed: 'Tài khoản này đã bị xóa khỏi hệ thống, vui lòng liên hệ email: vuhuynhminh9221@gmail.com để được hỗ trợ',
    email_not_active: 'Tài khoản này chưa được kích hoạt, vui lòng kiểm tra email của bạn',
    email_undefined: 'Tài khoản này không tồn tại',
    password_not_match: 'Mật khẩu cũ không chính xác',
    token_not_existed: 'Token không tồn tại',
    login_failed: 'Sai tài khoản hoặc mật khẩu',
    server_error: 'Lỗi Server, vui lòng liên hệ admin: <b>vuhuynhminh9221@gmail.com</b> để được hỗ trợ',
    avatar_wrong_type: 'Kiểu file không hợp lệ, chỉ chấp nhận file có định dạng png, jpg, jpeg, gif',
		avatar_size_limit: 'Ảnh upload tối đa 1MB',
    image_message_wrong_type: 'Kiểu file không hợp lệ, chỉ chấp nhận file có định dạng png, jpg, jpeg, gif',
		image_message_size_limit: 'Ảnh upload tối đa 1MB',
		attachment_message_size_limit: 'Tệp đính kèm tối đa 1MB',
		group_not_found: 'Group chat không tồn tại',
		personal_not_found: 'Người dùng không tồn tại',
}

export const transSuccesses = {
    createdDone: email => {
        return `Tài khoản <strong>${email}</strong> đã được tạo, vui lòng kiểm tra email để kích hoạt tài khoản`
    },
    login_success: username => {
        return `Xin chào ${username}, chúc bạn một ngày tốt lành`
    },
    active_email_success: 'Kích hoạt tài khoản thành công! bạn đã có thể đăng nhập vào ứng dụng',
    user_info_updated: 'Cập nhật thông tin người dùng thành công',
    user_password_updated: 'Cập nhật mật khẩu thành công'
}

export const transMail = {
    subject: 'Xác nhận kích hoạt tài khoản!',
    template: linkVerify => {
        return `
        <h3> Link kích hoạt tài khoản trên ứng dụng Message App từ Admin VHM: </h3>
        <h3><a href="${linkVerify}" target="_blank">${linkVerify}</a></h3>`
    },
    send_failed: `Có lỗi trong quá trình gửi mail vui lòng liên hệ admin: <b>vuhuynhminh9221@gmail.com</b> để được hỗ trợ`
}
