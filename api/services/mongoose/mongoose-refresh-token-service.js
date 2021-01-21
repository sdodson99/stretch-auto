const RefreshToken = require('../../models/mongoose/refresh-token-schema')

class MongooseRefreshTokenService{

    /**
     * Get a refresh token by token.
     * @param {string} refreshToken The refresh token to search for.
     * @returns {object} The refresh token with the token.
     * @throws {Error} Thrown if query fails.
     */
    async getByRefreshToken(refreshToken){
        return await RefreshToken.findOne({refreshToken: refreshToken}).populate('user').exec()
    }

    /**
     * Create a new refresh token.
     * @param {object} refreshToken The refresh token to create.
     * @throws {Error} Thrown if create fails.
     */
    async create(refreshToken){
        await RefreshToken.create(refreshToken)
    }

    /**
     * Delete all refresh tokens for a user.
     * @param {string} userId The user's id.
     * @throws {Error} Thrown if delete fails.
     */
    async deleteAllForUserId(userId){
        await RefreshToken.deleteMany({userId: userId})
    }

    /**
     * Delete a refresh token by id.
     * @param {string} id The refresh token's id.
     * @throws {Error} Thrown if delete fails.
     */
    async deleteById(id) {
        await RefreshToken.deleteOne({_id: id})
    }
 }

module.exports = MongooseRefreshTokenService