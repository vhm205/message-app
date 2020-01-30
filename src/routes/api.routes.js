import express from "express";
import passport from 'passport';
import { authValidate } from '../validation/index';
import { home, auth } from "../controllers/index";
import initPassportLocal from '../controllers/passportController/local';
import initPassportFacebook from '../controllers/passportController/facebook';
import initPassportGoogle from '../controllers/passportController/google';

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

    router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }))
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/auth'
    }))

    router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] } ))
    router.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/auth'
    }))

    return app.use('/', router)
}

module.exports = initRoutes
