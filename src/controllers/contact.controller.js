import { contact } from '../services/index';
import { validationResult } from 'express-validator';

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
    findUsersContact
}
