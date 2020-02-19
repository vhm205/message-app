import addNewContact from './contacts/addNewContact';
import cancelRequestContact from './contacts/cancelRequestContact';

const initSockets = io => {
	addNewContact(io)
	cancelRequestContact(io)
}

module.exports = initSockets;
