export const transValidation = {
    email_incorrect: 'Email không hợp lệ!!',
    gender_incorrect: 'Giới tính không hợp lệ',
    password_incorrect: 'Mật khẩu phải có ít nhất 6 ký tự',
    password_confirm_incorrect: 'Mật khẩu không trùng khớp'
}

export const transErrors = {
    email_is_existed: 'Email này đã được sử dụng',
    email_is_removed: 'Tài khoản này đã bị xóa khỏi hệ thống, vui lòng liên hệ email: vuhuynhminh9221@gmail.com để được hỗ trợ',
    email_not_active: 'Tài khoản này đã đăng ký nhưng chưa được kích hoạt, vui lòng kiểm tra email của bạn'
}

export const transSuccesses = {
    createdDone: email => {
        return `Tài khoản <strong>${email}</strong> đã được tạo, vui lòng kiểm tra email để kích hoạt tài khoản`
    }
}
