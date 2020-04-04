import { validationResult } from 'express-validator';
import { message } from '../services/index';

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

module.exports = {
	addNewMessage
}
