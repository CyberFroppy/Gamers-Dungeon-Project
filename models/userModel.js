const mongoose = require("mongoose");

const usersCollectionSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const usersCollection = mongoose.model("users", usersCollectionSchema);

const Users = {
    createUser: async function(newUser) {
        return usersCollection
            .create(newUser)
            .then(createdUser => createdUser);
    },
    getAllUsers: async function() {
        return usersCollection
            .find()
            .then(allUsers => allUsers);
    }
};

module.exports = {
    Users
};
