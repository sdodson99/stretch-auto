const mongo = require('mongodb')
const MongoGenericService = require('./mongo-generic-service')

class MongoRoutineService {
    constructor(connectionString){
        this.collectionName = "routines"
        this.connectionString = connectionString
        this.genericService = new MongoGenericService(this.connectionString, this.collectionName)
    }

    async getAll(){
        return await this.genericService.getAll()
    }

    async getAllForUser(userId){
        let connection = await this.genericService.mongoClient.connect(this.connectionString)

        let routines = await connection.db("stretch").collection(this.collectionName).find({ownerId: userId}).toArray()

        connection.close()

        return routines
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