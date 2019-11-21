const mongoose = require('mongoose')
const Schema = mongoose.Schema

let instructionSchema = new Schema({
    order: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

module.exports = instructionSchema