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
        await RefreshToken.deleteMany({userId: userId})
    }

    async deleteById(id) {
        await RefreshToken.deleteOne({_id: id})
    }
 }

module.exports = MongooseRefreshTokenService