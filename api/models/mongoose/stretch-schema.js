const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StretchInstructionSchema = require('./stretch-instruction-schema')

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
        type: [StretchInstructionSchema],
        required: false
    }
})

module.exports = mongoose.model("Stretch", stretchSchema, "stretches")