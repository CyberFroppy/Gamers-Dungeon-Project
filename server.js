const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
    Users
} = require("./models/userModel");
const {Games} = require("./models/gameModel");
const {
    PORT,
    DATABASE_URL,
    API_SECRET,
    HASHING_ROUNDS
} = require('./config');
const {
    validate
} = require("./middleware/authenticate");

const userValidation = validate(false);
const adminValidation = validate(true);
const app = express();
const jsonParser = bodyParser.json();

app.use(morgan('dev'));
app.use(express.static("public"));

function error(res) {
    return function(err) {
        res.statusMessage = err.message;
        return res.status(400).end();
    };
}

function createToken(res) {
    return function(user) {
        if (user) {
            let userData = {
                username: user.username,
                userType: user.userType
            };
            return jwt.sign(userData, API_SECRET, {
                expiresIn: '3h'
            }, (err, token) => {
                if (err) {
                    return error(res)(err);
                }
                return res.status(201).json({
                    token: token
                });
            });
        }
        res.statusMessage = 'Error creating token for user';
        return res.status(400).end();
    };
}

app.post('/api/add-game', [adminValidation ,jsonParser], (req, res) => {
    const {
        gamename,
        stock
    } = req.body;

    if (!gamename || !stock) {
        res.statusMessage = "Missing parameters for game creation";
        return res.status(406).end();
    }

    let gameData = {gamename, stock};

    return Games.addGame(gameData).then(createdGame => {
        if(createdGame) {
            return res.status(201).json(createdGame);
        }
        res.statusMessage = "Something went wrong creating game";
        return res.status(400).end();
    }).catch(error(res));
});

app.get('/api/verify-token', userValidation, (_, res) => {
    return res.status(200).end();
});

app.post('/api/register', jsonParser, (req, res) => {
    const {
        username,
        password
    } = req.body;
    if (!username || !password) {
        res.statusMessage = "Missing parameters in the body of the request";
        return res.status(406).end();
    }

    return bcrypt.hash(password, HASHING_ROUNDS)
        .then(hashedPassword => {
            let userData = {
                username,
                password: hashedPassword
            };

            return Users
                .createUser(userData)
                .then(createToken(res))
                .catch(error(res));
        })
        .catch(error(res));
});

app.post('/api/login', jsonParser, (req, res) => {
    let {
        username,
        password
    } = req.body;

    if (!username || !password) {
        res.statusMessage = "Parameters missing in the body for the request";
        return res.status(406).end();
    }

    return Users
        .getUserByUsername(username)
        .then(user => {
            if (user) {
                return bcrypt.compare(password, user.password)
                    .then(result => {
                        if (result) {
                            return createToken(res)(user);
                        }
                        res.statusMessage = "Wrong credentials";
                        return res.status(409).end();
                    })
                    .catch(error(res));
            }
            res.statusMessage = "User not found";
            return res.status(409).end();
        })
        .catch(error(res));
});

app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);

    new Promise((resolve, reject) => {
            mongoose.connect(DATABASE_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }, err => err ? reject(err) : resolve());
        })
        .catch(err => {
            mongoose.disconnect();
            console.log(err);
        });
});
