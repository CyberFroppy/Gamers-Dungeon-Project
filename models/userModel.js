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
    },
    userType: {
        type: String,
        enum : ['user', 'admin'],
        default: 'user'
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
    },
    getUserByUsername: async function(username) {
        return usersCollection
            .findOne({username : username})
            .then(user => user);
    }
};

module.exports = {
    Users
};
