import { group } from '../services/index';
import { validationResult } from 'express-validator';

const findUsersContact = async (req, res) => {
	let errorsArr = []
	let errorsRes = validationResult(req)

	if (!errorsRes.isEmpty()) {
		Object.values(errorsRes.mapped()).forEach(e => errorsArr.push(e.msg))
		return res.status(500).send(errorsArr)
	}

	try {
		const keyword = req.query.keyword
		const currentUserId = req.user._id

		const users = await group.findUsersContact(currentUserId, keyword)

		return res.render('main/groupChat/_FindToAddGroupChat', { users })
	} catch (err) {
		return res.status(500).send(err)
	}
}

const addNewChatGroup = async (req, res) => {
	let errorsArr = []
	let errorsRes = validationResult(req)

	if (!errorsRes.isEmpty()) {
		Object.values(errorsRes.mapped()).forEach(e => errorsArr.push(e.msg))
		return res.status(500).send(errorsArr)
	}

	try {
		const currentUserId = req.user._id
		const { name, amount, members } = req.body

		const addNewGroupChat = await group.addNewChatGroup(currentUserId, name, amount, members);
		return res.status(200).send(addNewGroupChat)
	} catch (err) {
		return res.status(500).send(err)
	}
}

const leaveGroupChat = async (req, res) => {
	try {
		const currentUserId = req.user._id;
		const groupId = req.body.groupId;
		const leaveGroup = await group.leaveGroupChat(currentUserId, groupId);

		return res.status(200).send(leaveGroup);
	} catch (err) {
		return res.status(500).send(err);
	}
}

module.exports = {
	addNewChatGroup,
	findUsersContact,
	leaveGroupChat
}
