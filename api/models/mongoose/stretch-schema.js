const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InstructionSchema = require('./instruction-schema')

const stretchSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isUnilateral: {
        type: Boolean,
        required: false,
        default: false
    },
    instructions: {
        type: [InstructionSchema],
        required: false
    }
})

module.exports = mongoose.model("Stretch", stretchSchema, "stretches")