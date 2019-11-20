const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Swiper = new Schema({
    pic: {
        type: String,
        // required: true
    },
    sort: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        default: 1
    },
    title: {
        type: String,
        required: true
    }
}, {versionKey: false, timestamps: {createdAt: "create_time", updatedAt: "update_time"}});

module.exports = mongoose.model("Swiper", Swiper);
