import { validationResult } from 'express-validator';

const getLogin = (_, res) => {
    res.render('auth/master')
}

const postRegister = (req, res) => {
    let errorsArr = []
    let errorsRes = validationResult(req)

    if(!errorsRes.isEmpty()){
        let errors = Object.values(errorsRes.mapped())

        errors.forEach(e => errorsArr.push(e))

        return 
    }

    res.send(req.body)
}


module.exports = {
    getLogin,
    postRegister
}
