import User from '../models/user.model';
import Contact from '../models/contact.model';

const findUsersContact = (id, keyword) => {
    return new Promise(async (resolve, _) => {
        let deprecatedUserId = [];
        let contactsByUser = await Contact.findAllByUser(id)

        contactsByUser.map(contact => {
            deprecatedUserId = [...deprecatedUserId, contact.userId, contact.contactId]
        })
        deprecatedUserId = [...new Set(deprecatedUserId)]

        // Find All User except for those who have already made friends
        const allUsers = await User.findAllUserForAddContact(deprecatedUserId, keyword)
        resolve(allUsers)
    })
}

module.exports = {
    findUsersContact
}
