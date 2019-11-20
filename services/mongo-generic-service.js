const mongo = require('mongodb')

class MongoGenericService{
    constructor(database, collectionName){
        this.database = database
        this.collectionName = collectionName
    }

    //Get all entities in the collection.
    //Returns the list of entities.
    async getAll(){
        return await this.database.collection(this.collectionName).find({}).toArray()
    }

    //Get an entity by id.
    //Returns the entity if it exists.
    //Returns undefined if entity not found.
    async getById(id){
        try {
            let mongoId = new mongo.ObjectID(id)
            var entity = await this.database.collection(this.collectionName).findOne({_id: mongoId}) 
        } catch (error) {
            //Do nothing, return undefined.
        }

        return entity
    }

    //Inserts a new entity into the database.
    //Returns the id of the new entity.
    async create(entity){
        let createResult = await this.database.collection(this.collectionName).insertOne(entity)

        return createResult.insertedId
    }

    //Update an entity at the id with a new entity.
    //TODO: Assign id to new object?
    //Returns true/false for success.
    async update(id, entity){
        let mongoId = new mongo.ObjectID(id)
        let updateResult = await this.database.collection(this.collectionName).replaceOne({_id: mongoId}, entity)

        return updateResult.matchedCount > 0
    }

    //Delete an entity by id.
    //Returns true/false for success.
    async delete(id){
        let deleteResult = await this.database.collection(this.collectionName).deleteOne({_id: new mongo.ObjectID(id)})

        return deleteResult.deletedCount > 0
    }
}

module.exports = MongoGenericService