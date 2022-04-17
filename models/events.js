const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    imageURL: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    time: Date,
    registrationStart:  Date,
    registrationEnd: Date,
    maxParticipants: {
        type: Number,
        default: 1,
    },
    isListed: Boolean,
    registered: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        enum: [
            "Fun",
            "Tech",
            "Workshop"
        ],
    },
    organisers: [
        {
            name: String,
            phone: String
        }
    ],
});


module.exports = mongoose.model("Event", eventSchema);
