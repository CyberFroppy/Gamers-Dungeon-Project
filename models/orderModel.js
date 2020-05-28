const mongoose = require("mongoose");

const ordersCollectionSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    food: [{
        name: String,
        quantity: Number
    }],
    tableNo: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const ordersCollection = mongoose.model('orders', ordersCollectionSchema);

const Orders = {
    createOrder: async function(newOrder) {
        return ordersCollection
            .create(newOrder)
            .then(createdOrder => createdOrder);
    },
    getOrders: async function() {
        return ordersCollection
            .find()
            .then(orders => orders);
    }
};

module.exports = {
    Orders
};
