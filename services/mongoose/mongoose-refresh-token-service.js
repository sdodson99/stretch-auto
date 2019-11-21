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

    async deleteAllForEmail(email){
        let deleteResult = await RefreshToken.deleteMany({email: email})
        
        return deleteResult.ok
    }
}

module.exports = MongooseRefreshTokenService