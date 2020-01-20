export const transValidation = {
    email_incorrect: 'Email không hợp lệ!!',
    gender_incorrect: 'Giới tính không hợp lệ',
    password_incorrect: 'Mật khẩu phải có ít nhất 6 ký tự',
    password_confirm_incorrect: 'Mật khẩu không trùng khớp'
}

export const transErrors = {
    email_is_existed: 'Email này đã được sử dụng',
    email_is_removed: 'Tài khoản này đã bị xóa khỏi hệ thống, vui lòng liên hệ email: vuhuynhminh9221@gmail.com để được hỗ trợ',
    email_not_active: 'Tài khoản này đã đăng ký nhưng chưa được kích hoạt, vui lòng kiểm tra email của bạn',
    token_not_existed: 'Token không tồn tại, tài khoản này đã được kích hoạt'
}

export const transSuccesses = {
    createdDone: email => {
        return `Tài khoản <strong>${email}</strong> đã được tạo, vui lòng kiểm tra email để kích hoạt tài khoản`
    },
    active_email_success: 'Kích hoạt tài khoản thành công! bạn đã có thể đăng nhập vào ứng dụng'
}

export const transMail = {
    subject: "Xác nhận kích hoạt tài khoản!",
    template: linkVerify => {
        return `
        <h3> Link kích hoạt tài khoản trên ứng dụng Message App từ Admin VHM: </h3>
        <h3><a href="${linkVerify}" target="_blank">${linkVerify}</a></h3>`
    },
    send_failed: `Có lỗi trong quá trình gửi mail vui lòng liên hệ admin: <b>vuhuynhminh9221@gmail.com</b> để được hỗ trợ`
}
