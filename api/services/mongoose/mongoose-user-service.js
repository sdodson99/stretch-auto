const User = require('../../models/mongoose/user-schema')
const MongooseGenericService = require('./mongoose-generic-service')

class MongooseUserService {
    
    /**
     * Get a user by id.
     * @param {string} id The user's id.
     * @returns {object} The user with the id.
     * @throws {Error} Thrown if query fails.
     */
    async getById(id){
        return await User.findOne({_id: id}).exec()
    }

    /**
     * Get a user by email.
     * @param {string} email The user's email.
     * @returns {object} The user with the email.
     * @throws {Error} Thrown if query fails.
     */
    async getByEmail(email){
        return await User.findOne({email: email}).exec()
    }

    /**
     * Create a new user.
     * @param {object} user The user to create.
     * @throws {Error} Thrown if create fails.
     */
    async create(user){
        await User.create(user)
    }
}

module.exports = MongooseUserService