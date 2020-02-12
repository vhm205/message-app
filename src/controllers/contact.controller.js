import { contact } from '../services/index';
import { validationResult } from 'express-validator';

const addRequestContact = async (req, res) => {
    try {
        const currentId = req.user._id
        const contactId = req.body.uid
        
        const requestAddFriend = await contact.addRequestContact(currentId, contactId)
        return res.status(201).send({ success: !!requestAddFriend })
    } catch (err) {
        return res.status(500).send(err)
    }
}

const cancelRequestContact = async (req, res) => {
    try {
        const currentId = req.user._id
        const contactId = req.body.uid

        const requestCancelFriend = await contact.cancelRequestContact(currentId, contactId)
        return res.status(200).send({ success: !!requestCancelFriend })
    } catch (err) {
        return res.status(500).send(err)
    }
}

const findUsersContact = async (req, res) => {
    let errorsArr = []
    let errorsRes = validationResult(req)

    if(!errorsRes.isEmpty()){
        let errors = Object.values(errorsRes.mapped())

        errors.forEach(e => errorsArr.push(e.msg))

        return res.status(500).send(errorsArr)
    }

    try {
        const keyword = req.query.keyword
        const currentUserId = req.user._id

        const users = await contact.findUsersContact(currentUserId, keyword);

        return res.render('main/contact/_FindToAddContact', { users })
    } catch (err) {
        res.status(500).send(err)
    }
}

module.exports = {
    findUsersContact,
    addRequestContact,
    cancelRequestContact
}
