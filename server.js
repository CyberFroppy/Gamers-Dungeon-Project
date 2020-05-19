const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const {PORT, DATABASE_URL} = require('./config');

const app = express();
const jsonParser = bodyParser.json();

app.use(morgan('dev'));
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);

    new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, err => err ? reject(err) : resolve());
    })
        .catch(err => {
            mongoose.disconnect();
            console.log(err);
        });
});
