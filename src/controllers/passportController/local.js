import passport from 'passport';
import passportLocal from 'passport-local';
import UserModel from '../../models/user.model';
import ChatGroupModel from '../../models/chatGroup.model';
import { transErrors, transSuccesses } from '../../../lang/vi';

const LocalStrategy = passportLocal.Strategy

const initPassportLocal = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
					const user = await UserModel.findByEmail(email)
					if(!user){ 
						return done(null, false, req.flash('errors', transErrors.login_failed))
					}

					if(!user.local.isActive){
						return done(null, false, req.flash('errors', transErrors.email_not_active))
					}
					
					const checkPassword = await user.comparePassword(password)
					if(!checkPassword){
						return done(null, false, req.flash('errors', transErrors.login_failed))
					}

					return done(null, user, req.flash('success', transSuccesses.login_success(user.username)))
        } catch (err) {
					return done(null, false, req.flash('errors', transErrors.server_error))
        }
    }))

    // Save userId into session
    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })

    // This is called by passport.session()
    passport.deserializeUser(async (id, done) => {
			try {
				let user = await UserModel.findUserById(id)
				let getChatGroup = await ChatGroupModel.getGroupByUserId(user._id)

				user = user.toObject()
				user.chatGroupIds = getChatGroup

				done(null, user)
			} catch (error) {
				done(error, null)
			}
    })
}

module.exports = initPassportLocal
