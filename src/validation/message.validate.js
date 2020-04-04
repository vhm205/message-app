import { check } from 'express-validator';
import { transValidation } from '../../lang/vi';

const checkMessage = [
    check('text', transValidation.chat_message_incorrect)
        .isLength({ min: 1, max: 500 })
]

module.exports = {
    checkMessage
}
