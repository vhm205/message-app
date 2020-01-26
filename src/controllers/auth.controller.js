import { validationResult } from 'express-validator';
import { auth } from '../services/index';

const getLogin = (req, res) => {
    res.render('auth/master', {
        errors: req.flash('errors'),
        success: req.flash('success')
    })
}

const postRegister = async (req, res) => {
    let errorsArr = []
    let errorsRes = validationResult(req)

    if(!errorsRes.isEmpty()){
        let errors = Object.values(errorsRes.mapped())

        errors.forEach(e => errorsArr.push(e.msg))

        req.flash('errors', errorsArr)
        return res.redirect('/auth')
    }
    
    try {
        let result = await auth.register(req.body, req.protocol, req.get('host'))
        req.flash('success', result)
    } catch (error) {
        errorsArr.push(error)
        req.flash('errors', errorsArr)
    }

    res.redirect('/auth')
}

const verifyAccount = async (req, res) => {
    try {
        let verifySuccess = await auth.verifyAccount(req.params.token)
        req.flash('success', verifySuccess)
        return res.redirect('/auth')
    } catch (error) {
        req.flash('errors', error)
        return res.redirect('/auth')
    }
}


module.exports = {
    getLogin,
    postRegister,
    verifyAccount
}
