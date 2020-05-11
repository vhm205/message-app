import { check } from 'express-validator';
import { transValidation } from '../../lang/vi';

const createGroupChat = [
	check('name', transValidation.chatgroup_incorrect_name)
		.isLength({ min: 3, max: 30 })
		.escape()
		.matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
	check('amount', transValidation.chatgroup_too_few_human)
		.toInt()
		.isInt({ min: 2 })
]

module.exports = {
	createGroupChat
}
