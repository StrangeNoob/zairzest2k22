const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const teamSchema = new Schema({
    name: {
        type: String,
        uppercase: true
    },
    eventId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Event'
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    teamMember: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    teamExtraData:{
        type:Map,
        of: String,
    },
    member_count: Number
});

module.exports = mongoose.model("Team", teamSchema);
