import multer from 'multer';
import fsExtra from 'fs-extra';
import { user } from '../services/index';
import { app } from '../config/app';
import { validationResult } from 'express-validator';
import { transErrors, transSuccesses } from '../../lang/vi';

const storageAvatar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, app.avatar_directory)
    },
    filename: (_, file, cb) => {
        if(!app.avatar_type.includes(file.mimetype)){
            return cb(transErrors.avatar_wrong_type, null)
        }

        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadAvatarFile = multer({
    storage: storageAvatar,
    limits: { fileSize: app.avatar_size }
}).single('avatar')

const updateAvatar = (req, res) => {
    uploadAvatarFile(req, res, async err => {
        if(err){
            // A Multer error occurred when uploading.
            if(err instanceof multer.MulterError){
                return res.status(500).send(transErrors.avatar_size_limit)
            }
            return res.status(500).send(err)
        }

        try {
            // Get name of file avatar new
            const newFileName = req.file.filename
            const itemUser = {
                avatar: newFileName,
                updatedAt: Date.now()
            }

            // Update user avatar and Remove avatar old
            const userUpdate = await user.updateUser(req.user._id, itemUser)
            if(userUpdate.avatar !== 'avatar-default.png'){
                await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`)
            }
            
            return res.status(200).send({
                message: transSuccesses.user_info_updated,
                imageUrl: `./libraries/images/users/${newFileName}`
            })
        } catch (err) {
            return res.status(500).send(err)
        }
    })
}

const updateInfo = async (req, res) => {
    let errorsArr = []
    let errorsRes = validationResult(req)

    if(!errorsRes.isEmpty()){
        let errors = Object.values(errorsRes.mapped())

        errors.forEach(e => errorsArr.push(e.msg))

        return res.status(500).send(errorsArr)
    }

    try {
        const itemUser = Object.assign({}, req.body, { updatedAt: Date.now() })
        await user.updateUser(req.user._id, itemUser)

        return res.status(200).send({
            message: transSuccesses.user_info_updated
        })
    } catch (err) {
        return res.status(500).send(err)
    }
}

const updatePassword = async (req, res) => {
    let errorsArr = []
    let errorsRes = validationResult(req)

    if(!errorsRes.isEmpty()){
        let errors = Object.values(errorsRes.mapped())

        errors.forEach(e => errorsArr.push(e.msg))

        return res.status(500).send(errorsArr)
    }
    
    try {
        const itemUser = Object.assign({}, req.body, { updatedAt: Date.now() })
        await user.updatePassword(req.user._id, itemUser)

        return res.status(200).send({
            message: transSuccesses.user_password_updated
        })
    } catch (err) {
        return res.status(500).send(err)
    }
}

module.exports = {
    updateAvatar, 
    updateInfo,
    updatePassword
}
