import User from '../models/user.model';

const updateUser = (id, item) => {
    return User.updateUser(id, item)
}

module.exports = {
    updateUser
}
