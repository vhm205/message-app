import multer from 'multer';
import fsExtra from 'fs-extra';
import { transErrors } from '../../lang/vi';
import { validationResult } from 'express-validator';
import { message, group } from '../services/index';
import { app } from '../config/app';

// ------------------- Handle Upload image message ------------------
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

// ------------------- Handle Upload attachment message ------------------
const storageAttachmentChat = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, app.attachment_message_directory)
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	}
})

const uploadAttachmentMessage = multer({
	storage: storageAttachmentChat,
	limits: { fileSize: app.attachment_message_size }
}).single('attachment')

// ---------------------------  Controller -----------------------------------

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

const addNewAttachment = (req, res) => {
	uploadAttachmentMessage(req, res, async err => {
		if(err){
			// A Multer error occurred when uploading.
			if(err instanceof multer.MulterError){
					return res.status(500).send(transErrors.attachment_message_size_limit)
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
			const attachment = {
				attachmentBuff: fsExtra.readFileSync(req.file.path),
				contentType: req.file.mimetype,
				fileName: req.file.originalname
			}
			const newMessage = await message.addNewAttachment(sender, receiverId, attachment, isChatGroup)
			await fsExtra.remove(req.file.path)
	
			return res.status(200).send({ message: newMessage })
		} catch (error) {
			return res.status(500).send(error)
		}
	})
}

const getAllConversationsRemaining = async (req, res) => {
	try {
		// Get skip from query url
		const skipNumberGroup = +req.query.skip_group;
		const skipNumberPerson = +req.query.skip_person;
		const contactId = req.query.contact_id;

		// Get All Conversation of current user
		const { readMoreConversationWithMess, moreGroupRemainingWithMembers } = await message.getAllConversationsRemaining(req.user._id, contactId, skipNumberGroup, skipNumberPerson, group);

		return res.status(200).json({
			readMoreConversationWithMess,
			moreGroupRemainingWithMembers
		});
	} catch (err) {
		return res.status(500).send(err);
	}
}

const readMoreConversations = async (req, res) => {
	try {
		// Get skip from query url
		const skipNumberGroup = +req.query.skip_group;
		const skipNumberPerson = +req.query.skip_person;

		// Get more conversations
		const moreConversations = await message.readMoreConversations(req.user._id, skipNumberGroup, skipNumberPerson);
		const moreGroupWithMembers = await group.readMoreGroupWithMembers(req.user._id, skipNumberGroup);

		return res.status(200).json({
			moreConversations,
			moreGroupWithMembers
		});
	} catch (err) {
		return res.status(500).send(err);
	}
}

module.exports = {
	getAllConversationsRemaining,
	readMoreConversations,
	addNewMessage,
	addNewAttachment,
	addNewImage
}
