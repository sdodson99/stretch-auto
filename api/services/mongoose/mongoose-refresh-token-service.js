const MongooseGenericService = require('./mongoose-generic-service')
const RefreshToken = require('../../models/mongoose/refresh-token-schema')

class MongooseRefreshTokenService extends MongooseGenericService{
    constructor(){
        super(RefreshToken)
        this.model = RefreshToken
    }

    async getByRefreshToken(refreshToken){
        return await RefreshToken.findOne({refreshToken: refreshToken}).exec()
    }

    async deleteAllForUserId(userId){
        const deleteResult = await RefreshToken.deleteMany({userId: userId})
        
        return deleteResult.ok
    }

    async deleteById(id) {
        const deleteResult = await RefreshToken.deleteMany({_id: id})
        
        return deleteResult.ok
    }
 }

module.exports = MongooseRefreshTokenService