const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const {
    Users
} = require("./models/userModel");
const {
    Games
} = require("./models/gameModel");
const {
    Foods
} = require("./models/foodModel");
const {
    Reservations
} = require("./models/reservationModel");
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
                _id: user._id,
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

app.post('/api/reservation', [jsonParser, userValidation], (req, res) => {
    const userId = req.userInfo._id;
    console.log(userId);
    const {
        reservationName,
        tableNo,
        date,
        game,
        people
    } = req.body;
    if (!reservationName || !tableNo || !date || !game || !people) {
        res.statusMessage = "Missing parameters while creating reservation";
        return res.status(406).end();
    }
    const reservationInfo = {
        reservationName,
        tableNo,
        date,
        game,
        people,
        id: uuid.v4(),
        user: userId
    };
    return Reservations.createReservation(reservationInfo)
        .then(createdReservation => {
            if (createdReservation) {
                return res.status(201).json(createdReservation);
            }
            res.statusMessage = "Error while creating reservation";
            return res.status(400).end();
        }).catch(error(res));
});

app.post('/api/food', [adminValidation, jsonParser], (req, res) => {
    const {
        name,
        price
    } = req.body;
    if (!name || !price) {
        res.statusMessage = "Missing parameters while adding food";
        return res.status(406).end();
    }

    if (isNaN(price)) {
        res.statusMessage = "Price must be a numeric value";
        return res.status(406).end();
    }

    const foodInfo = {
        id: uuid.v4(),
        name,
        price
    };

    return Foods.addFood(foodInfo).
    then(newFood => {
            if (newFood) {
                return res.status(201).json(newFood);
            }
            res.statusMessage = "Something went wrong creating food";
            return res.status(400).end();
        })
        .catch(error(res));
});

app.get('/api/food', (_, res) => {
    return Foods.getFoods()
        .then(foods => res.status(200).json(foods))
        .catch(error(res));
});

app.delete('/api/food/:id', adminValidation, (req, res) => {
    const foodId = req.params.id;
    return Foods.removeFoodById(foodId)
        .then(removed => {
            if (removed.n === 0) {
                res.statusMessage = `No food with id: ${foodId}`;
                return res.status(404).end();
            }
            return res.status(200).end();
        })
        .catch(error(res));
});

app.patch('/api/food/:id', [adminValidation, jsonParser], (req, res) => {
    const foodId = req.params.id;
    const {
        name,
        price
    } = req.body;
    if (!name && !price) {
        res.statusMessage = "There must be at least one parameter to update";
        return res.status(406).end();
    }
    let foodInfo = {};
    if (name) foodInfo.name = name;
    if (price) foodInfo.price = price;
    return Foods.updateFood(foodId, foodInfo)
        .then(updatedFood => {
            if (updatedFood) {
                return res.status(202).json(updatedFood);
            }
            res.statusMessage = "Something went wrong while updating food";
            return res.status(400).end();
        }).catch(error(res));
});

app.patch('/api/games/:id', [adminValidation, jsonParser], (req, res) => {
    const gameId = req.params.id;
    const {
        gamename,
        stock,
        price,
        description
    } = req.body;

    if (!gamename && !stock && !price && !description) {
        res.statusMessage = "There must be at least one parameter to updated";
        return res.status(406).end();
    }

    if (stock && isNaN(stock) || price && isNaN(price)) {
        res.statusMessage = "Price and stock must be numeric values";
        return res.status(406).end();
    }

    const gameInfo = {};
    if (gamename) gameInfo.gamename = gamename;
    if (stock) gameInfo.stock = stock;
    if (price) gameInfo.price = price;
    if (description) gameInfo.description = description;

    return Games.updateGameById(gameId, gameInfo)
        .then(newGame => {
            if (newGame) {
                return res.status(202).json(newGame);
            }
            res.statusMessage = "Something went wrong while updating game";
            return res.status(400).end();
        }).catch(error(res));
});

app.post('/api/games', [adminValidation, jsonParser], (req, res) => {
    const {
        gamename,
        stock,
        price,
        description
    } = req.body;

    if (!gamename || !stock || !price || !description) {
        res.statusMessage = "Missing parameters for game creation";
        return res.status(406).end();
    }

    if (isNaN(stock) || isNaN(price)) {
        res.statusMessage = "Stock and price must be numeric values";
        return res.status(406).end();
    }

    let gameData = {
        gamename,
        stock,
        price,
        description,
        id: uuid.v4()
    };

    return Games.addGame(gameData).then(createdGame => {
        if (createdGame) {
            return res.status(201).json(createdGame);
        }
        res.statusMessage = "Something went wrong creating game";
        return res.status(400).end();
    }).catch(error(res));
});

app.get('/api/games', (_, res) => {
    return Games.getAllGames().then(games => {
        if (games) {
            return res.status(200).json(games);
        }
        res.statusMessage = "Something went wrong while getting the games";
        return res.status(400).end();
    }).catch(error(res));
});

app.get('/api/games/available', (_, res) => {
    return Games.getAvailableGames().then(games => {
        if (games) {
            return res.status(200).json(games);
        }
        res.statusMessage = "Something went wrong while getting available games";
        return res.status(400).end();
    }).catch(error(res));
});

app.delete('/api/games/:id', adminValidation, (req, res) => {
    let gameId = req.params.id;
    return Games.removeGameById(gameId).then(removed => {
        if (removed.n === 0) {
            res.statusMessage = `No game with id ${gameId}`;
            return res.status(404).end();
        }
        return res.status(200).end();
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
