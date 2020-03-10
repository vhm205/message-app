import UserModel from '../models/user.model';
import ContactModel from '../models/contact.model';
import { types, notifyModel } from '../models/notification.model';

const LIMIT_NUMBER_TAKEN = 2

const addRequestContact = (userId, contactId) => {
    return new Promise(async (resolve, reject) => {
        const checkExistsContact = await ContactModel.checkExists(userId, contactId)
        if(checkExistsContact){
            return reject(false)
        }

		// Create new contact in DB
        const newContactItem = {
            userId: userId,
            contactId: contactId
        }
		const newRequestContact = await ContactModel.createNew(newContactItem);
		
		// Create notify in DB
		const notifyItem = {
			senderId: userId,
			receiverId: contactId,
			type: types.ADD_CONTACT
		}
		await notifyModel.createNew(notifyItem);

        resolve(newRequestContact)
    })
}

const removeContact = (userId, contactId) => {
    return new Promise(async (resolve, reject) => {
		const rmContact = await ContactModel.removeContact(userId, contactId)		
        if(rmContact.deletedCount === 0) return reject(false);

        return resolve(true)
    })
}

const cancelRequestContact = (userId, contactId) => {
    return new Promise(async (resolve, reject) => {
        const removeRequestContact = await ContactModel.removeRequestContact(userId, contactId)
        if(removeRequestContact.n === 0) return reject(false);
		
		// Remove notify in DB
		await notifyModel.removeReqContactNotify(userId, contactId, types.ADD_CONTACT)
        
        return resolve(true)
    })
}

const removeRequestContactReceived = (userId, contactId) => {
    return new Promise(async (resolve, reject) => {
        const removeRequestContact = await ContactModel.removeRequestContactReceived(userId, contactId)
        if(removeRequestContact.n === 0) return reject(false);
		
		// Remove notify in DB
		// await notifyModel.removeReqContactNotify(userId, contactId, types.ADD_CONTACT)
        
        return resolve(true)
    })
}

const acceptRequestContactReceived = (userId, contactId) => {
    return new Promise(async (resolve, reject) => {
		const acceptRequestContact = await ContactModel.acceptRequestContactReceived(userId, contactId)		
        if(acceptRequestContact.nModified === 0) return reject(false);
		
		// Create notify in DB
		const notifyItem = {
			senderId: userId,
			receiverId: contactId,
			type: types.ACCEPT_CONTACT
		}
		await notifyModel.createNew(notifyItem);
        
        return resolve(true)
    })
}

const findUsersContact = (userId, keyword) => {
    return new Promise(async (resolve, _) => {
        let deprecatedUserId = [userId];
        let contactsByUser = await ContactModel.findAllByUser(userId)

		// Add user has made friends
        contactsByUser.forEach(contact => {
            deprecatedUserId = [...deprecatedUserId, contact.userId, contact.contactId]
        })
        deprecatedUserId = [...new Set(deprecatedUserId)]

        // Find All User except for those who have already made friends
        const allUsers = await UserModel.findAllUserForAddContact(deprecatedUserId, keyword)        
        resolve(allUsers)
    })
}

const getContacts = userId => {
	return new Promise(async (resolve, reject) => {
		try {
			const contacts = await ContactModel.getContacts(userId, LIMIT_NUMBER_TAKEN)
			const users = contacts.map(async contact => {
				if(contact.contactId == userId){
					return await UserModel.findNormalUserById(contact.userId)
				}
				return await UserModel.findNormalUserById(contact.contactId)
			})

			resolve(await Promise.all(users))
		} catch (err) {
			console.error(err);
			reject(err)
		}
	})
}

const getContactsSent = userId => {
	return new Promise(async (resolve, reject) => {
		try {
			const contacts = await ContactModel.getContactsSent(userId, LIMIT_NUMBER_TAKEN)
			const users = contacts.map(async contact => {
				return await UserModel.findNormalUserById(contact.contactId)
			})
		
			resolve(await Promise.all(users))
		} catch (err) {
			console.error(err);
			reject(err)
		}
	})
}

const getContactsReceived = userId => {
	return new Promise(async (resolve, reject) => {
		try {
			const contacts = await ContactModel.getContactsReceived(userId, LIMIT_NUMBER_TAKEN)
			const users = contacts.map(async contact => {
				return await UserModel.findNormalUserById(contact.userId)
			})

			resolve(await Promise.all(users))
		} catch (err) {
			console.error(err);
			reject(err)
		}
	})
}

const countAllContacts = userId => {
	return new Promise(async (resolve, reject) => {
		try {
			const count = await ContactModel.countAllContacts(userId)
			resolve(count)
		} catch (err) {
			console.error(err);
			reject(err)
		}
	})
}

const countAllContactsSend = userId => {
	return new Promise(async (resolve, reject) => {
		try {
			const count = await ContactModel.countAllContactsSend(userId)
			resolve(count)
		} catch (err) {
			console.error(err);
			reject(err)
		}
	})
}

const countAllContactsReceived = userId => {
	return new Promise(async (resolve, reject) => {
		try {
			const count = await ContactModel.countAllContactsReceived(userId)
			resolve(count)
		} catch (err) {
			console.error(err);
			reject(err)
		}
	})
}

const readMoreContacts = (userId, skip) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get more contacts and limit (Skip old)
			const moreContacts = await ContactModel.readMoreContacts(userId, skip, LIMIT_NUMBER_TAKEN);
			const getContents = moreContacts.map(async contact => {
				if(contact.contactId == userId){
					return await UserModel.findNormalUserById(contact.userId)
				}
				return await UserModel.findNormalUserById(contact.contactId)
			})
			
			resolve(await Promise.all(getContents))
		} catch (err) {
			reject(err)
		}
	})
}

const readMoreContactsSent = (userId, skip) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get more contacts sent and limit (Skip old)
			const moreContactsSent = await ContactModel.readMoreContactsSent(userId, skip, LIMIT_NUMBER_TAKEN);
			const getContents = moreContactsSent.map(async contact => {
				return await UserModel.findNormalUserById(contact.contactId)
			})
			
			resolve(await Promise.all(getContents))
		} catch (err) {
			reject(err)
		}
	})
}

const readMoreContactsReceived = (userId, skip) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get more contacts received and limit (Skip old)
			const moreContactsReceived = await ContactModel.readMoreContactsReceived(userId, skip, LIMIT_NUMBER_TAKEN);
			const getContents = moreContactsReceived.map(async contact => {
				return await UserModel.findNormalUserById(contact.userId)
			})
			
			resolve(await Promise.all(getContents))
		} catch (err) {
			reject(err)
		}
	})
}

module.exports = {
    findUsersContact,
    addRequestContact,
	cancelRequestContact,
	removeContact,
	removeRequestContactReceived,
	acceptRequestContactReceived,
	countAllContacts,
	countAllContactsSend,
	countAllContactsReceived,
	readMoreContacts,
	readMoreContactsSent,
	readMoreContactsReceived,
	getContactsReceived,
	getContactsSent,
	getContacts
}
