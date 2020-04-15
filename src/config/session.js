import session from 'express-session';
import connectMongo from 'connect-mongo';

const MongoStore = connectMongo(session)

const sessionStore = new MongoStore({
    url: `${process.env.DB_CONNECTION}://${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    autoReconnect: true,
    autoRemove: 'native'
})

const configSession = app => {
    app.use(session({
        secret: process.env.SECRET_SESSION,
        saveUninitialized: false,
        resave: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60**2 * 24 // one day
        }
    }))
}

module.exports = {
    configSession,
    sessionStore
}
