import http             from 'http';
import express          from 'express';
import connectFlash     from 'connect-flash';
import passport         from 'passport';
import socketio         from 'socket.io';
import cookieParser     from 'cookie-parser';
import passportSocketIo from 'passport.socketio';
import configSocketIo   from './config/socketio';
import configViewEngine from './config/viewEngine';
import connectDB        from './config/connectDB';
import initRoutes       from './routes/api.routes';
import initSockets      from './sockets/index';
import { configSession, sessionStore } from './config/session';

const app    = express()
const server = http.createServer(app)
const io     = socketio(server)

connectDB()
configSession(app)
configViewEngine(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(connectFlash())
app.use(cookieParser())

app.use(passport.initialize())
app.use(passport.session())

initRoutes(app)

configSocketIo(io, passportSocketIo, sessionStore, cookieParser)

initSockets(io)

const PORT = process.env.PORT || 1002
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))


// import https            from 'https';
// import pem              from 'pem';

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     if (err) {
//         throw err
//     }
//     const app = express()    

//     config()
//     connectDB()
//     configSession(app)
//     configViewEngine(app)

//     app.use(express.json())
//     app.use(express.urlencoded({ extended: true }))
//     app.use(connectFlash())

//     app.use(passport.initialize())
//     app.use(passport.session())

//     initRoutes(app)

//     const PORT = process.env.PORT || 1002
//     https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(PORT, () => console.log(`Server is running on port ${PORT}`))
// })
