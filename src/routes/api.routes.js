import express from "express";
import passport from 'passport';
import { authValidate } from '../validation/index';
import { home, auth } from "../controllers/index";
import initPassportLocal from '../controllers/passportController/local';

initPassportLocal()
const router = express.Router()

const initRoutes = app => {
    router.get('/', auth.checkLoggedIn, home.getHome)
    router.get('/auth', auth.checkLoggedOut, auth.getLogin)
    router.get('/logout', auth.checkLoggedIn, auth.getLogout)
    router.get('/verify/:token', auth.verifyAccount)
    router.post('/register', auth.checkLoggedOut, authValidate.register, authValidate.register, auth.postRegister)
    router.post('/login', auth.checkLoggedOut, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth',
        successFlash: true,
        failureFlash: true
    }))

    return app.use('/', router)
}

module.exports = initRoutes
