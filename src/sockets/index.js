import addNewContact from './contacts/addNewContact';
import removeRequestContact from './contacts/removeRequestContact';
import removeRequestContactReceived from './contacts/removeRequestContactReceived';
import acceptRequestContactReceived from './contacts/acceptRequestContactReceived';

const initSockets = io => {
	addNewContact(io)
	removeRequestContact(io)
	removeRequestContactReceived(io)
	acceptRequestContactReceived(io)
}

module.exports = initSockets;
