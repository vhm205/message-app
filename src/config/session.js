import session from 'express-session';
import connectMongo from 'connect-mongo';

const MongoStore = connectMongo(session)

const configSession = app => {
    app.use(session({
        secret: process.env.SECRET_SESSION,
        saveUninitialized: false,
        resave: true,
        store: new MongoStore({
            url: `${process.env.DB_CONNECTION}://${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            autoReconnect: true,
            autoRemove: 'native'  
        }),
        cookie: {
            maxAge: 1000 * Math.pow(60, 2) * 24
        }
    }))
}

module.exports = configSession
