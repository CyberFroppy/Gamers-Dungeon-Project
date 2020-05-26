const mongoose = require("mongoose");

const reservationsCollectionSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    tableNo: {
        type: Number,
        required: true
    },
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    food: [{
        name: String,
        quantity: Number
    }],
    date: {
        type: String,
        required: true
    }
});

const reservationsCollection = mongoose.model('reservations', reservationsCollectionSchema);

const Reservations = {
    createReservation: async function(newReservation) {
        return reservationsCollection
            .create(newReservation)
            .then(createdReservation => createdReservation);
    },
    getReservationById: async function(reservationId) {
        return reservationsCollection
            .find({
                id: reservationId
            })
            .populate('user', ['username'])
            .then(reservation => reservation);
    },
    getReservations: async function() {
        return reservationsCollection
            .find()
            .populate('user', ['username'])
            .then(reservations => reservations);
    }
};


module.exports = {
    Reservations
};
