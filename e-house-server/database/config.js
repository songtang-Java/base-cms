const mongoose = require('mongoose');

mongoose.connect(
    'mongodb://localhost:27017/ehome',
    { useNewUrlParser: true, useCreateIndex: true},
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open',console.log.bind(console,'connection success!'))

module.exports = db;
