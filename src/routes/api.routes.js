import express from "express";
import passport from 'passport';
import { authValidate } from '../validation/index';
import { home, auth } from "../controllers/index";
import initPassportLocal from '../controllers/passportController/local';

initPassportLocal()
const router = express.Router()

const initRoutes = app => {
    router.get('/', home.getHome)
    router.get('/auth', auth.getLogin)
    router.get('/verify/:token', auth.verifyAccount)
    router.post('/register', authValidate.register, authValidate.register, auth.postRegister)
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth',
        successFlash: true,
        failureFlash: true
    }))

    return app.use('/', router)
}

module.exports = initRoutes
