import passport from 'passport';
import passportFacebook from 'passport-facebook';
import UserModel from '../../models/user.model';
import ChatGroupModel from '../../models/chatGroup.model';
import { transErrors, transSuccesses } from '../../../lang/vi';

const FacebookStrategy = passportFacebook.Strategy

const initPassportFacebook = () => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: process.env.FB_CALLBACK_URL,
        passReqToCallback: true,
        profileFields: ["displayName", "gender", "photos", "email"]
    }, async (req, accessToken, _, profile, done) => {
        try {
            let user = await UserModel.findByFacebookUid(profile.id)
            if(user){ 
                return done(null, user, req.flash('success', transSuccesses.login_success(user.username)))
            }

            let newUser = {
                username: profile.displayName === undefined ? profile.emails[0].value.split('@')[0] : profile.displayName,
                gender: profile.gender === undefined ? 'male' : profile.gender,
                local: { isActive: true },
                facebook: {
                    uid: profile.id,
                    email: profile.emails[0].value,
                    token: accessToken
                }
            }

            const newUserFacebook = await UserModel.createNew(newUser)
            
            return done(null, newUserFacebook, req.flash('success', transSuccesses.login_success(newUserFacebook.username)))
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

module.exports = initPassportFacebook
