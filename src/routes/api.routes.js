import express from "express";
import passport from 'passport';
import { authValidate, userValidate } from '../validation/index';
import { home, auth, user } from "../controllers/index";
import initPassportLocal    from '../controllers/passportController/local';
import initPassportFacebook from '../controllers/passportController/facebook';
import initPassportGoogle   from '../controllers/passportController/google';

initPassportLocal()
initPassportFacebook()
initPassportGoogle()

const router = express.Router()

const initRoutes = app => {
    router.get('/', auth.checkLoggedIn, home.getHome)
    router.get('/auth', auth.checkLoggedOut, auth.getLogin)
    router.get('/logout', auth.checkLoggedIn, auth.getLogout)
    router.get('/verify/:token', auth.verifyAccount)
    router.post('/register', auth.checkLoggedOut, authValidate.register, auth.postRegister)
    router.post('/login', auth.checkLoggedOut, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth',
        successFlash: true,
        failureFlash: true
    }))

    router.get('/auth/facebook', auth.checkLoggedOut, passport.authenticate('facebook', { scope: ['email'] }))
    router.get('/auth/facebook/callback', auth.checkLoggedOut, passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/auth'
    }))

    router.get('/auth/google', auth.checkLoggedOut, passport.authenticate('google', { scope: ['email', 'profile'] } ))
    router.get('/auth/google/callback', auth.checkLoggedOut, passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/auth'
    }))

    router.patch('/user/update-avatar', auth.checkLoggedIn, user.updateAvatar)
    router.patch('/user/update-info', auth.checkLoggedIn, userValidate.updateInfo, user.updateInfo)

    return app.use('/', router)
}

module.exports = initRoutes
