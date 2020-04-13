import multer from 'multer';
import fsExtra from 'fs-extra';
import { transErrors } from '../../lang/vi';
import { validationResult } from 'express-validator';
import { message } from '../services/index';
import { app } from '../config/app';

const addNewMessage = async (req, res) => {
	let errorsRes = validationResult(req)

	if(!errorsRes.isEmpty()){
		let errorsArr = []
		Object.values(errorsRes.mapped()).forEach(e => errorsArr.push(e.msg))
		return res.status(500).send(errorsArr)
	}

	try {
		const sender = {
			id: req.user._id,
			name: req.user.username,
			avatar: req.user.avatar
		}

		const { receiverId, text, isChatGroup } = req.body		
		const newMessage = await message.addNewMessage(sender, receiverId, text, isChatGroup)

		return res.status(200).send({ message: newMessage })
	} catch (error) {
		return res.status(500).send(error)
	}
}

const storageImageChat = multer.diskStorage({
	destination: (req, file, cb) => {
			cb(null, app.image_message_directory)
	},
	filename: (_, file, cb) => {
			if(!app.image_message_type.includes(file.mimetype)){
					return cb(transErrors.image_message_wrong_type, null)
			}

			cb(null, file.originalname)
	}
})

const uploadImageMessage = multer({
	storage: storageImageChat,
	limits: { fileSize: app.image_message_size }
}).single('image')

const addNewImage = (req, res) => {
	uploadImageMessage(req, res, async err => {
		if(err){
			// A Multer error occurred when uploading.
			if(err instanceof multer.MulterError){
					return res.status(500).send(transErrors.image_message_size_limit)
			}
			return res.status(500).send(err)
		}

		try {
			const sender = {
				id: req.user._id,
				name: req.user.username,
				avatar: req.user.avatar
			}
	
			const { receiverId, isChatGroup } = req.body
			const image = {
				imageBuff: fsExtra.readFileSync(req.file.path),
				contentType: req.file.mimetype,
				fileName: req.file.originalname
			}
			const newMessage = await message.addNewImage(sender, receiverId, image, isChatGroup)
			await fsExtra.remove(req.file.path)
	
			return res.status(200).send({ message: newMessage })
		} catch (error) {
			return res.status(500).send(error)
		}
	})
}

module.exports = {
	addNewMessage,
	addNewImage
}
