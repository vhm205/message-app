import User from '../models/user.model';
import Contact from '../models/contact.model';

const addRequestContact = (currentId, contactId) => {
    return new Promise(async (resolve, reject) => {
        const checkExistsContact = await Contact.checkExists(currentId, contactId)

        if(checkExistsContact){
            return reject(false)
        }

        const newContactItem = {
            userId: currentId,
            contactId: contactId
        }

        const newRequestContact = await Contact.createNew(newContactItem)
        resolve(newRequestContact)
    })
}

const cancelRequestContact = (currentId, contactId) => {
    return new Promise(async (resolve, reject) => {
        const removeRequestContact = await Contact.removeRequestContact(currentId, contactId)
        if(removeRequestContact.n === 0){
            return reject(false)
        }
        return resolve(true)
    })
}

const findUsersContact = (id, keyword) => {
    return new Promise(async (resolve, _) => {
        let deprecatedUserId = [id];
        let contactsByUser = await Contact.findAllByUser(id)

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
