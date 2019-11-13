const mongo = require('mongodb')

const mongoClient = mongo.MongoClient

class MongoStretchService{
    constructor(connectionString){
        this.connectionString = connectionString
    }

    async getAll(){
        let connection = await mongoClient.connect(this.connectionString)
        
        let stretches = await connection.db("stretch").collection("stretches").find({}).toArray()

        connection.close()

        return stretches
    }

    async getRandomAmount(maxAmount){
        let connection = await mongoClient.connect(this.connectionString)

        let stretches = []

        for (let index = 0; index < maxAmount; index++) {

            //Get 1 random stretch from the collection not including stretches already found.
            let randomStretch = (await connection.db("stretch").collection("stretches").aggregate([
                { $match: { _id: {$nin: stretches.map((stretch) => stretch ? new mongo.ObjectId(stretch._id) : 0)}}},
                { $sample: {size: 1}}
            ]).toArray())[0]

            //If the collection returned a stretch, add it to the collection. Otherwise, there are no 
            //more possible stretches to be found and we can simply break.
            if(randomStretch){
                stretches.push(randomStretch)
            } else {
                break
            }
        }

        connection.close()

        return stretches
    }

    async create(stretch){
        let connection = await mongoClient.connect(this.connectionString)

        let newStretchId = (await connection.db("stretch").collection("stretches").insertOne(stretch)).insertedId

        connection.close()

        return newStretchId
    }
}

module.exports = MongoStretchService