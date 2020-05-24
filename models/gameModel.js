const mongoose = require("mongoose");

const gamesCollectionSchema = mongoose.Schema({
    gamename: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
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
    removeGameByName: async function(gamename) {
        return gamesCollection
            .deleteOne({
                gamename: gamename
            })
            .then(deleted => deleted);
    }
};

module.exports = {
    Games
};
