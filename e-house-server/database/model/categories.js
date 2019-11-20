const mongoose = require("mongoose");
const categories = new mongoose.Schema({
    newsType: {
        type: String,
        required: true
    }
}, {versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}});

module.exports = mongoose.model("categories", categories);
