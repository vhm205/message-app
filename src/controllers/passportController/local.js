import passport from 'passport';
import passportLocal from 'passport-local';
import User from '../../models/user.model';
import { transErrors, transSuccesses } from '../../../lang/vi';

const LocalStrategy = passportLocal.Strategy

const initPassportLocal = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            let user = await User.findByEmail(email)
            if(!user){ 
                return done(null, false, req.flash('errors', transErrors.login_failed))
            }

            if(!user.local.isActive){
                return done(null, false, req.flash('errors', transErrors.email_not_active))
            }
            
            let checkPassword = await user.comparePassword(password)
            if(!checkPassword){
                return done(null, false, req.flash('errors', transErrors.login_failed))
            }

            return done(null, user, req.flash('success', transSuccesses.login_success(user.username)))
        } catch (err) {
            console.log(err)
            done(null, user, req.flash('success', transErrors.server_error))
            throw new Error(err)
        }
    }))

    // Save userId into session
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    // This is called by passport.session()
    passport.deserializeUser((id, done) => {
        User.findUserById(id)
            .then(user => done(null, user))
            .catch(error => done(error, null))
    })
}

module.exports = initPassportLocal
