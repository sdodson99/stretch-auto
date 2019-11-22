const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const Schema = mongoose.Schema

let routineStretchSchema = new Schema({
    stretch: {
        type: Schema.Types.ObjectId,
        ref: 'Stretch',
        required: true,
        autopopulate: true
    },
    sets: {
        type: Number,
        required: false,
        default: 1
    }, 
    duration: {
        type: Number,
        required: false,
        default: 10
    }
}, {_id: false})

routineStretchSchema.plugin(autopopulate)

module.exports = routineStretchSchema