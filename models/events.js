const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  imageURL: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: false,
    default: "",
  },
  time: {
    type: Date,
    required: false,
  },
  registrationStart: {
    type: Date,
    required: false,
  },
  registrationEnd: {
    type: Date,
    required: false,
  },
  maxParticipants: {
    type: Number,
    default: 1,
  },
  isListed: Boolean,
  registered: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: ["fun", "tech", "workshop"],
  },
  organisers: [
    {
      name: String,
      phone: String,
    },
  ],
  
});

module.exports = mongoose.model("Event", eventSchema);
