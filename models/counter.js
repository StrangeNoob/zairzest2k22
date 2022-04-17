const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')


const counterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

counterSchema.plugin(findOrCreate);

module.exports = mongoose.model('counter', counterSchema);