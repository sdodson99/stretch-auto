class MongooseGenericService{
    constructor(model){
        this.model = model
    }

    //Get all entities.
    //Returns the list of entities.
    async getAll(){
        return await this.model.find({}).exec()
    }

    //Get an entity by id.
    //Returns the entity if it exists.
    //Returns undefined if entity not found.
    async getById(id){
        return await this.model.findOne({_id: id}).exec()
    }

    //Inserts a new entity into the database.
    //Returns the id of the new entity.
    async create(entity){
        let newEntity = await this.model.create(entity)

        return newEntity._id
    }

    //Update an entity at the id with a new entity.
    //TODO: Assign id to new object?
    //Returns true/false for success.
    async update(id, entity){
        let updateResult = await this.model.updateOne({_id: id}, entity);

        return updateResult.n > 0
    }

    //Delete an entity by id.
    //Returns true/false for success.
    async delete(id){
        let deleteResult = await this.model.deleteOne({_id: id})

        return deleteResult.deletedCount > 0
    }
}

module.exports = MongooseGenericService