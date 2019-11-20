const mongoose = require('mongoose');

const news = new mongoose.Schema({
    title: String,
    newsDesc: String,
    contentText: String,
    img: String,
    author: {
        type: String,
        required:  true
    },
    newsType: {
        type: String,
        required: true
    },
},{versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}});

module.exports = mongoose.model('news',news);
