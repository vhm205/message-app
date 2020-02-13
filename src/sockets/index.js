import addNewContact from './contacts/addNewContact';

const initSockets = io => {
    addNewContact(io)
}

module.exports = initSockets;
