import { config }       from 'dotenv';
import express          from 'express';
import connectFlash     from 'connect-flash';
import passport         from 'passport';
import connectDB        from './config/connectDB';
import configViewEngine from './config/viewEngine';
import configSession    from './config/session';
import initRoutes       from './routes/api.routes';
import https            from 'https';
import pem              from 'pem';

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
    if (err) {
        throw err
    }
    const app = express()    

    config()
    connectDB()
    configSession(app)
    configViewEngine(app)

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(connectFlash())

    app.use(passport.initialize())
    app.use(passport.session())

    initRoutes(app)

    const PORT = process.env.PORT || 1002
    https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(PORT, () => console.log(`Server is running on port ${PORT}`))
})

// const app = express()

// config()
// connectDB()
// configSession(app)
// configViewEngine(app)

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(connectFlash())

// app.use(passport.initialize())
// app.use(passport.session())

// initRoutes(app)

// const PORT = process.env.PORT || 1002
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
