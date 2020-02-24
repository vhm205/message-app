import User from '../models/user.model';
import Contact from '../models/contact.model';
import { types, notifyModel } from '../models/notification.model';

const addRequestContact = (currentId, contactId) => {
    return new Promise(async (resolve, reject) => {
        const checkExistsContact = await Contact.checkExists(currentId, contactId)
        if(checkExistsContact){
            return reject(false)
        }

		// Create new contact in DB
        const newContactItem = {
            userId: currentId,
            contactId: contactId
        }
		const newRequestContact = await Contact.createNew(newContactItem);
		
		// Create notify in DB
		const notifyItem = {
			senderId: currentId,
			receiverId: contactId,
			type: types.ADD_CONTACT
		}
		await notifyModel.createNew(notifyItem);

        resolve(newRequestContact)
    })
}

const cancelRequestContact = (currentId, contactId) => {
    return new Promise(async (resolve, reject) => {
        const removeRequestContact = await Contact.removeRequestContact(currentId, contactId)
        if(removeRequestContact.n === 0){
            return reject(false)
		}
		
		// Remove notify in DB
		await notifyModel.removeReqContactNotify(currentId, contactId, types.ADD_CONTACT)
        
        return resolve(true)
    })
}

const findUsersContact = (id, keyword) => {
    return new Promise(async (resolve, _) => {
        let deprecatedUserId = [id];
        let contactsByUser = await Contact.findAllByUser(id)

		// Add user has made friends
        contactsByUser.forEach(contact => {
            deprecatedUserId = [...deprecatedUserId, contact.userId, contact.contactId]
        })
        deprecatedUserId = [...new Set(deprecatedUserId)]

        // Find All User except for those who have already made friends
        const allUsers = await User.findAllUserForAddContact(deprecatedUserId, keyword)        
        resolve(allUsers)
    })
}

module.exports = {
    findUsersContact,
    addRequestContact,
    cancelRequestContact
}
