import { check } from 'express-validator';
import { transValidation, transErrors } from '../../lang/vi';

const updateInfo = [
    check('username', transValidation.username_update)
        .optional()
        .isLength({ min: 3, max: 20 })
        .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
    check('gender', transValidation.gender_update)
        .optional()
        .isIn(['male', 'female']),
    check('address', transValidation.address_update)
        .optional()
        .isLength({ min: 3, max: 30 }),
    check('phone', transValidation.phone_update)
        .optional()
        .matches(/^(0)[0-9]{9,10}$/)
]

const updatePassword = [
    check('currentPassword', transValidation.password_incorrect)
        .isLength({ min: 6 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/),
    check('newPassword', transValidation.password_incorrect)
        .isLength({ min: 6 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/),
    check('confirmNewPassword', transValidation.password_confirm_incorrect)
        .custom((value, { req }) => value === req.body.newPassword)
]

module.exports = {
    updateInfo,
    updatePassword
}
