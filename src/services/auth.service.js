import { transErrors, transSuccesses } from '../../lang/vi';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';

const saltBound = 7

const register = ({ email, gender, password }) => {
    return new Promise(async (resolve, reject) => {
        let checkEmail = await User.findByEmail(email)
        if(checkEmail){
            if(checkEmail.deletedAt !== null) return reject(transErrors.email_is_removed)
            if(!checkEmail.local.isActive) return reject(transErrors.email_not_active)
            return reject(transErrors.email_is_existed)
        }

        let salt = bcrypt.genSaltSync(saltBound)
        let userItem = {
            username: email.split('@')[0],
            gender: gender,
            local: {
                email: email,
                password: bcrypt.hashSync(password, salt),
                verifyToken: uuidv4()
            }
        }

        let newUser = await User.createNew(userItem)
        resolve(transSuccesses.createdDone(newUser.local.email))
    })
}

module.exports = {
    register
}