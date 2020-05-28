const mongoose = require("mongoose");

const cartsCollectionSchema = mongoose.Schema({
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: 'users'
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'games'
    }
});

const cartsCollection = mongoose.model('carts', cartsCollectionSchema);

const Carts = {
    addGameToCart: async function(userId, gameId) {
        return cartsCollection.updateOne({
            user: userId
        }, {
            $set: {
                game: gameId
            }
        }).then(carts => carts);
    },
    createCart: async function(user) {
        return cartsCollection.create({
                user,
                game: null
            }).then(cart => cart)
            .catch(err => console.log(err));
    },
    getCart: async function(user) {
        return cartsCollection.findOne({
            user: user
        }).populate('game', ['gamename', 'stock', 'price', 'image', 'id']).then(cart => cart);
    },
    removeGame: async function(user) {
        return cartsCollection.updateOne({
            user: user
        }, {
            $set: {
                game: null
            }
        }).then(carts => carts);
    }
};

module.exports = {
    Carts
};
