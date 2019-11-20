const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comments = new Schema({
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    status: {
        type: Number,
        default: 0
    }
}, {versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}});

module.exports = mongoose.model("comments", Comments);
