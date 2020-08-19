const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const user = require('../Schemas/Post');

app.use(bodyParser.json());
app.use(express.static('./dist/Angular'));

mongoose.connect(
    'mongodb://127.0.0.1:27017/project',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
    console.log("Connection Successful!");
});

let port = process.env.PORT || 3600;
app.listen(port, () => console.log("Server Is OK"));
