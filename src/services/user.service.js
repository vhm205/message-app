import UserModel from '../models/user.model';
import bcrypt from 'bcrypt';
import { transErrors } from '../../lang/vi';

const saltRound = 7

const updateUser = (id, item) => {
	return UserModel.updateUser(id, item)
}

const updatePassword = (id, item) => {
	return new Promise(async (resolve, reject) => {
		const { currentPassword, newPassword } = item;
		const currentUser = await UserModel.findUserByIdToUpdatePassword(id);

		if(!currentUser){
				return reject(transErrors.email_undefined)
		}
		
		const checkCurrentPassword = await currentUser.comparePassword(currentPassword);
		if(!checkCurrentPassword){
				return reject(transErrors.password_not_match)
		}

		const salt = bcrypt.genSaltSync(saltRound)
		await UserModel.updatePassword(id, bcrypt.hashSync(newPassword, salt))

		resolve()
	})
}

module.exports = {
    updateUser,
    updatePassword
}
