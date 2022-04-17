const mongoose = require('mongoose');
const teamSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        uppercase: true
    },
    eventId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Event'
    },
    leader: {
        type: mongoose.SchemaType.ObjectId,
        ref: 'User',
    },
    teamMember: [{
        type: mongoose.SchemaType.ObjectId,
        ref: 'User',
    }],
    teamExtraData:{
        type:Map,
        of: String,
    },
    member_count: Number
});

module.exports = mongoose.model("Team", teamSchema);
