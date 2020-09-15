require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(
    process.env.MONGO,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;

db.on("error", console.error.bind());

db.once("open", function () { });

module.exports = db;