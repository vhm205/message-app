import express from "express";
import passport from 'passport';
import { authValid, userValid, contactValid } from '../validation/index';
import { home, auth, user, contact } from "../controllers/index";
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
    router.post('/register', auth.checkLoggedOut, authValid.register, auth.postRegister)
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
    router.patch('/user/update-info', auth.checkLoggedIn, userValid.updateInfo, user.updateInfo)
    router.patch('/user/update-password', auth.checkLoggedIn, userValid.updatePassword, user.updatePassword)

    router.get('/contact/find-user', auth.checkLoggedIn, contactValid.findUsersContact, contact.findUsersContact)
    router.post('/contact/add-request-contact', auth.checkLoggedIn, contact.addRequestContact)
    router.delete('/contact/cancel-request-contact', auth.checkLoggedIn, contact.cancelRequestContact)

    return app.use('/', router)
}

module.exports = initRoutes
