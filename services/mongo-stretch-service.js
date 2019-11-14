const mongo = require('mongodb')

const mongoClient = mongo.MongoClient

class MongoStretchService{
    constructor(connectionString){
        this.connectionString = connectionString
    }

    //Get all stretches in the database.
    //Returns the list of stretches.
    async getAll(){
        let connection = await mongoClient.connect(this.connectionString)
        
        let stretches = await connection.db("stretch").collection("stretches").find({}).toArray()

        connection.close()

        return stretches
    }

    //Gets a random amount of stretches from the database without duplicates.
    //Returns the list of stretches.
    async getRandomAmount(maxAmount){
        let connection = await mongoClient.connect(this.connectionString)

        let stretches = []
        let ids = []

        for (let index = 0; index < maxAmount; index++) {

            //Get 1 random stretch from the collection not including stretches already found.
            let randomStretch = (await connection.db("stretch").collection("stretches").aggregate([
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
        let connection = await mongoClient.connect(this.connectionString)

        let stretch = await connection.db("stretch").collection("stretches").findOne({_id: new mongo.ObjectID(id)})

        connection.close()

        return stretch
    }

    //Inserts a new stretch into the database.
    //Returns the id of the new stretch.
    async create(stretch){
        let connection = await mongoClient.connect(this.connectionString)

        let newStretchId = (await connection.db("stretch").collection("stretches").insertOne(stretch)).insertedId

        connection.close()

        return newStretchId
    }

    //Delete a stretch by id.
    //Returns true/false for success.
    async delete(id){
        let connection = await mongoClient.connect(this.connectionString)

        let deletedResult = await connection.db("stretch").collection("stretches").deleteOne({_id: new mongo.ObjectID(id)})

        connection.close()

        return deletedResult.deletedCount > 0
    }
}

module.exports = MongoStretchService