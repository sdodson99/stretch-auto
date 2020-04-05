const MongooseGenericService = require('./mongoose-generic-service')
const Routine = require('../../models/mongoose/routine-schema')

class MongooseRoutineService extends MongooseGenericService{
    constructor(){
        super(Routine)
        this.model = Routine
    }

    async getAllForUser(userId){
        return await this.model.find({ownerId: userId}).exec()
    }
}

module.exports = MongooseRoutineService