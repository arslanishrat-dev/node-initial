const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please Add A Title"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Add Description"]
    },
    weeks: {
        type: Number,
        required: [true, "Please Add Number Of Weeks"]
    },
    minimumSkill: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: [true, "Minimum Skill Is Required"]
    },
    scholarshipsAvailable: {
        type: Boolean,
        default: false
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
        required: true
    }
});

module.exports = mongoose.model('Subject', SubjectSchema);