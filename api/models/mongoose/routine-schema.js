const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const RoutineStretchSchema = require('./routine-stretch-schema')
const Schema = mongoose.Schema

let routineSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stretches: {
        type: [RoutineStretchSchema],
        required: false,
        default: []
    }
})

routineSchema.plugin(autopopulate)

module.exports = mongoose.model('Routine', routineSchema, "routines")