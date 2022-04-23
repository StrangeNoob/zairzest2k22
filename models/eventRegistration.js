const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: false,
      index: true,
    },
    extraData: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

eventRegistrationSchema.index({ unique: true });

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);
