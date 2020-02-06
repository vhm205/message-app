import { transErrors, transSuccesses, transMail } from '../../lang/vi';
import User from '../models/user.model';
import sendMail from '../config/mailer';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';

const saltRound = 7

const register = ({ email, gender, password }, protocol, hostname) => {
    return new Promise(async (resolve, reject) => {
        let checkEmail = await User.findByEmail(email)
        if(checkEmail){
            if(checkEmail.deletedAt !== null) return reject(transErrors.email_is_removed)
            if(!checkEmail.local.isActive) return reject(transErrors.email_not_active)
            return reject(transErrors.email_is_existed)
        }

        let salt = bcrypt.genSaltSync(saltRound)
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
        let linkVerify = `${protocol}://${hostname}/verify/${newUser.local.verifyToken}`
        
        sendMail(email, transMail.subject, transMail.template(linkVerify))
            .then(_ => {
                resolve(transSuccesses.createdDone(newUser.local.email))
            })
            .catch(async _ => {
                await User.removeById(newUser._id)
                reject(transMail.send_failed)
            })
    })
}

const verifyAccount = token => {
    return new Promise(async (resolve, reject) => {
        let checkToken = await User.findByToken(token)
        if(!checkToken) return reject(transErrors.token_not_existed)

        await User.verify(token)
        resolve(transSuccesses.active_email_success)
    })
}

module.exports = {
    register,
    verifyAccount
}
