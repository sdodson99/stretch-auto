const mongoose = require('mongoose')
const Schema = mongoose.Schema

const refreshTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    refreshToken: {
        type: String
    }
})

module.exports = mongoose.model("RefreshToken", refreshTokenSchema, "refresh_tokens")