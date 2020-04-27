import express from "express";
import passport from 'passport';
import {
	authValid,
	userValid,
	contactValid,
	messageValid,
	groupValid
} from '../validation/index';

import {
	home, auth, user, contact, notification, message, group
} from "../controllers/index";
import initPassportLocal from '../controllers/passportController/local';
import initPassportFacebook from '../controllers/passportController/facebook';
import initPassportGoogle from '../controllers/passportController/google';

initPassportLocal();
initPassportFacebook();
initPassportGoogle();

const router = express.Router();

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

	router.get('/auth/google', auth.checkLoggedOut, passport.authenticate('google', { scope: ['email', 'profile'] }))
	router.get('/auth/google/callback', auth.checkLoggedOut, passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/auth'
	}))

	router.patch('/user/update-avatar', auth.checkLoggedIn, user.updateAvatar)
	router.patch('/user/update-info', auth.checkLoggedIn, userValid.updateInfo, user.updateInfo)
	router.patch('/user/update-password', auth.checkLoggedIn, userValid.updatePassword, user.updatePassword)

	router.get('/contact/find-user', auth.checkLoggedIn, contactValid.findUsersContact, contact.findUsersContact)
	router.get('/contact/search-user', auth.checkLoggedIn, contactValid.findUsersContact, contact.searchUserChat)
	router.post('/contact/add-request-contact', auth.checkLoggedIn, contact.addRequestContact)
	router.delete('/contact/remove-contact', auth.checkLoggedIn, contact.removeContact)
	router.delete('/contact/remove-request-contact', auth.checkLoggedIn, contact.cancelRequestContact)
	router.delete('/contact/remove-request-contact-received', auth.checkLoggedIn, contact.removeRequestContactReceived)
	router.patch('/contact/accept-request-contact-received', auth.checkLoggedIn, contact.acceptRequestContactReceived)
	router.get('/contact/read-more-contacts', auth.checkLoggedIn, contact.readMoreContacts)
	router.get('/contact/read-more-contacts-sent', auth.checkLoggedIn, contact.readMoreContactsSent)
	router.get('/contact/read-more-contacts-received', auth.checkLoggedIn, contact.readMoreContactsReceived)

	router.get('/notification/read-more', auth.checkLoggedIn, notification.readMoreNotif)
	router.patch('/notification/mark-all-as-read', auth.checkLoggedIn, notification.markAllAsRead)

	router.post('/message/add-new-message', auth.checkLoggedIn, messageValid.checkMessage, message.addNewMessage)
	router.post('/message/add-new-image', auth.checkLoggedIn, message.addNewImage)
	router.post('/message/add-new-attachment', auth.checkLoggedIn, message.addNewAttachment)

	router.get('/group/find-user', auth.checkLoggedIn, contactValid.findUsersContact, group.findUsersContact)
	router.post('/group/add-new-group', auth.checkLoggedIn, groupValid.createGroupChat, group.addNewChatGroup)

	return app.use('/', router)
}

module.exports = initRoutes;
