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
        return res.redirect('/login')
    }
    
    try {
        let result = await auth.register(req.body)
        req.flash('success', result)
    } catch (error) {
        errorsArr.push(error)
        req.flash('errors', errorsArr)
    }

    res.redirect('/login')
}


module.exports = {
    getLogin,
    postRegister
}
