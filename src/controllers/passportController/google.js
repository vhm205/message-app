import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import UserModel from '../../models/user.model';
import ChatGroupModel from '../../models/chatGroup.model';
import { transErrors, transSuccesses } from '../../../lang/vi';

const GoogleStrategy = passportGoogle.Strategy

const initPassportGoogle = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GG_APP_ID,
        clientSecret: process.env.GG_APP_SECRET,
        callbackURL: process.env.GG_CALLBACK_URL,
        passReqToCallback: true
    }, async (req, accessToken, _, profile, done) => {
        try {
            let user = await UserModel.findByGoogleUid(profile.id)
            if(user){ 
                return done(null, user, req.flash('success', transSuccesses.login_success(user.username)))
            }
            
            let newUser = {
                username: profile.displayName === undefined ? profile.emails[0].value.split('@')[0] : profile.displayName,
                gender: profile.gender === undefined ? 'male' : profile.gender,
                local: { isActive: true },
                google: {
                    uid: profile.id,
                    email: profile.emails[0].value,
                    token: accessToken
                }
            }

            const newUserGoogle = await UserModel.createNew(newUser)

            return done(null, newUserGoogle, req.flash('success', transSuccesses.login_success(newUserGoogle.username)))
        } catch (err) {
            done(null, false, req.flash('errors', transErrors.server_error))
            throw new Error(err)
        }
    }))

    // Save userId into session
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    // This is called by passport.session()
    passport.deserializeUser(async (id, done) => {
			try {
				let user = await UserModel.findUserById(id)
				let getChatGroup = await ChatGroupModel.getGroupIdByUserId(user._id)

				user = user.toObject()
				user.chatGroupIds = getChatGroup

				done(null, user)
			} catch (error) {
				done(error, null)
			}
    })
}

module.exports = initPassportGoogle
