import addNewContact from './contacts/addNewContact';
import removeRequestContact from './contacts/removeRequestContact';
import removeRequestContactReceived from './contacts/removeRequestContactReceived';

const initSockets = io => {
	addNewContact(io)
	removeRequestContact(io)
	removeRequestContactReceived(io)
}

module.exports = initSockets;
