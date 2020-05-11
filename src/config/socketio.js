const configSocketIo = (io, passportSocketIo, sessionStore, cookieParser) => {
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        secret: process.env.SECRET_SESSION,
        store: sessionStore,
        success: (data, accept) => {
            if(!data.user.logged_in){
                return accept('Invalid User!', false)
            }
            return accept(null, true)
        },
        fail: (_, message, error, accept) => {
            if(error){
                console.log('Failed connection to socket.io: ', message);
                return accept(new Error(message), false)
            }
        }
    }))
}

module.exports = configSocketIo;
