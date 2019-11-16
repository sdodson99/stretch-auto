const mongo = require('mongodb')
const mongoClient = mongo.MongoClient

class MongoGenericService{
    constructor(connectionString, collectionName){
        this.connectionString = connectionString
        this.collectionName = collectionName
    }

    //Get all entities in the collection.
    //Returns the list of entities.
    async getAll(){
        let connection = await mongoClient.connect(this.connectionString)
        
        let entities = await connection.db("stretch").collection(this.collectionName).find({}).toArray()

        connection.close()

        return entities
    }

    //Get an entity by id.
    //Returns the entity if it exists.
    //Returns undefined if entity not found.
    async getById(id){
        let connection = await mongoClient.connect(this.connectionString)
        
        try {
            let mongoId = new mongo.ObjectID(id)
            var entity = await connection.db("stretch").collection(this.collectionName).findOne({_id: mongoId}) 
        } catch (error) {
            //Do nothing, return undefined.
        }

        connection.close()

        return entity
    }

    //Inserts a new entity into the database.
    //Returns the id of the new entity.
    async create(entity){
        let connection = await mongoClient.connect(this.connectionString)

        let newEntityId = (await connection.db("stretch").collection(this.collectionName).insertOne(entity)).insertedId

        connection.close()

        return newEntityId
    }

    //Update an entity at the id with a new entity.
    //Returns true/false for success.
    async update(id, entity){
        let connection = await mongoClient.connect(this.connectionString)

        let mongoId = new mongo.ObjectID(id)
        let updateResult = await connection.db("stretch").collection(this.collectionName).replaceOne({_id: mongoId}, entity)

        connection.close()

        return updateResult.matchedCount > 0
    }

    //Delete an entity by id.
    //Returns true/false for success.
    async delete(id){
        let connection = await mongoClient.connect(this.connectionString)

        let deletedResult = await connection.db("stretch").collection(this.collectionName).deleteOne({_id: new mongo.ObjectID(id)})

        connection.close()

        return deletedResult.deletedCount > 0
    }
}

module.exports = MongoGenericService