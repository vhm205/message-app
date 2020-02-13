const addNewContact = io => {
    io.on('connection', socket => {
        socket.on('request-add-contact', data => {
            console.log(data);
            console.log(socket.request.user);
        })
    })
}

module.exports = addNewContact;
