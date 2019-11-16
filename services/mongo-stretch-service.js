const mongo = require('mongodb')
const mongoClient = mongo.MongoClient

const MongoGenericService = require('./mongo-generic-service')

class MongoStretchService {
    constructor(connectionString){
        this.connectionString = connectionString
        this.collectionName = "stretches"
        this.genericService = new MongoGenericService(connectionString, this.collectionName)
    }

    //Get all stretches in the database.
    //Returns the list of stretches.
    async getAll(){
        return await this.genericService.getAll()
    }

    //Gets a random amount of stretches from the database without duplicates.
    //Returns the list of stretches.
    async getRandomAmount(maxAmount){
        let connection = await mongoClient.connect(this.connectionString)

        let stretches = []
        let ids = []

        for (let index = 0; index < maxAmount; index++) {

            //Get 1 random stretch from the collection not including stretches already found.
            let randomStretch = (await connection.db("stretch").collection(this.collectionName).aggregate([
                { $match: { _id: {$nin: ids}}},
                { $sample: {size: 1}}
            ]).toArray())[0]

            //If the collection returned a stretch, add it to the collection. Otherwise, there are no 
            //more possible stretches to be found and we can simply break.
            if(randomStretch){
                stretches.push(randomStretch)
                ids.push(new mongo.ObjectID(randomStretch._id))
            } else {
                break
            }
        }

        connection.close()

        return stretches
    }

    //Get a stretch by id.
    //Returns the stretch if it exists.
    //Returns undefined if stretch not found.
    async getById(id){
        return await this.genericService.getById(id)
    }

    //Inserts a new stretch into the database.
    //Returns the id of the new stretch.
    async create(stretch){
        return await this.genericService.create(stretch)
    }

    //Update a stretch at the id with a new stretch.
    //Returns true/false for success.
    async update(id, stretch){
        return await this.genericService.update(id, stretch)
    }

    //Delete a stretch by id.
    //Returns true/false for success.
    async delete(id){
        return await this.genericService.delete(id)
    }
}

module.exports = MongoStretchService