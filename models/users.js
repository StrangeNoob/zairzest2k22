const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    zid: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    profilePic: {
        type: String,
        required: false,
        default: '/assets/images/default-profile.png'
    },
    event: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Event'
    }],
    regNo: {
        type: Number,
    },
    phone: String,
    branch: {
        type: String,
        enum: [
            "Computer Science & Engineering",
            "Information Technology",
            "Electrical Engineering",
            "Mechanical Engineering",
            "Electronics & Intrumentation Engineering",
            "Biotechnology",
            "Civil Engineering",
            "Textile Engineering",
            "Fashion & Apparel Technology",
            "Architecture",
            "Computer Science & Application",
            "Planning",
            "Mathematics & Humanities",
            "Physics",
            "Chemistry",
        ],
    },
    isPaid: {
        type: Boolean,
        default: false
    },

})

module.exports = mongoose.model("User", userSchema);
