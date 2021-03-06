const mongoose = require("mongoose");

const gamesCollectionSchema = mongoose.Schema({
    gamename: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const gamesCollection = mongoose.model("games", gamesCollectionSchema);

const Games = {
    addGame: async function(newGame) {
        return gamesCollection
            .create(newGame)
            .then(createdGame => createdGame);
    },
    getGameById: async function(id) {
        return gamesCollection
            .findOne({
                id: id
            })
            .then(foundGame => foundGame);
    },
    getAllGames: async function() {
        return gamesCollection
            .find()
            .then(allGames => allGames);
    },
    getAvailableGames: async function() {
        return gamesCollection
            .find({
                stock: {
                    $gte: 1
                }
            })
            .then(availableGames => availableGames);
    },
    removeGameById: async function(gameId) {
        return gamesCollection
            .deleteOne({
                id: gameId
            })
            .then(deleted => deleted);
    },
    updateGameById: async function(gameId, newInfo) {
        return gamesCollection
            .findOneAndUpdate({
                id: gameId
            }, newInfo, {
                new: true
            })
            .then(updatedGame => updatedGame);
    },
    updateStock: async function(gameId, stock) {
        return gamesCollection.findOneAndUpdate({
            id: gameId
        }, {
            $set: {
                stock: stock
            }
        }, {
            new: true
        }).then(updatedGame => updatedGame);
    }
};

module.exports = {
    Games
};
