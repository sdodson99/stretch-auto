const User = require('../../models/mongoose/user-schema')
const MongooseGenericService = require('./mongoose-generic-service')

class MongooseUserService extends MongooseGenericService{
    constructor(){
        super(User)
        this.model = User
    }

    //Get a user by id.
    //Returns the user if it exists.
    //Returns undefined if user not found.
    async getByEmail(email){
        return await this.model.findOne({email: email}).exec()
    }
}

module.exports = MongooseUserService