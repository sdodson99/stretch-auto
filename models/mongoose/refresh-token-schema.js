const mongoose = require('mongoose')
const Schema = mongoose.Schema

let refreshTokenSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
})

module.exports = mongoose.model("RefreshToken", refreshTokenSchema, "refresh_tokens")