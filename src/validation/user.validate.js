import { check } from 'express-validator';
import { transValidation } from '../../lang/vi';

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

module.exports = {
    updateInfo
}
