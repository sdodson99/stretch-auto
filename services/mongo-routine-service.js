const MongoGenericService = require('./mongo-generic-service')

class MongoRoutineService {
    constructor(database){
        this.database = database
        this.collectionName = "routines"
        this.genericService = new MongoGenericService(this.database, this.collectionName)
    }

    async getAll(){
        return await this.genericService.getAll()
    }

    async getAllForUser(userId){
        return await this.database.collection(this.collectionName).find({ownerId: userId}).toArray()
    }

    async getById(id){
        return await this.genericService.getById(id)
    }

    async create(routine){
        return await this.genericService.create(routine)
    }

    async update(id, routine){
        return await this.genericService.update(id, routine)
    }

    async delete(id){
        return await this.genericService.delete(id)
    }
}

module.exports = MongoRoutineService