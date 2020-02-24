import { validationResult } from 'express-validator';
import { auth } from '../services/index';

const getLogin = (req, res) => {
    res.render('auth/master', {
        errors: req.flash('errors'),
        success: req.flash('success')
    })
}

const getLogout = (req, res) => {
    req.logout()
    return res.redirect('/auth')
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

const checkLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect('/auth')
    next()
}

const checkLoggedOut = (req, res, next) => {
	if(req.isAuthenticated()) return res.redirect('/')
    next()
}

module.exports = {
    getLogin,
    getLogout,
    postRegister,
    verifyAccount,
    checkLoggedIn,
    checkLoggedOut
}
