const Stretch = require('../../models/mongoose/stretch-schema')
const MongooseGenericService = require('./mongoose-generic-service')

class MongooseStretchService extends MongooseGenericService{
    constructor(){
        super(Stretch)
        this.model = Stretch
    }

    //Gets a random amount of stretches from the database without duplicates.
    //Returns the list of stretches.
    async getRandomAmount(maxAmount){
        let stretches = []
        let ids = []

        for (let index = 0; index < maxAmount; index++) {

            //Get 1 random stretch from the collection not including stretches already found.
            let randomStretch = (await this.model.aggregate([
                { $match: { _id: {$nin: ids}}},
                { $sample: {size: 1}}
            ]))[0]

            //If the collection returned a stretch, add it to the collection. Otherwise, there are no 
            //more possible stretches to be found and we can simply break.
            if(randomStretch){
                stretches.push(randomStretch)
                ids.push(randomStretch._id)
            } else {
                break
            }
        }

        return stretches
    }
}

module.exports = MongooseStretchService