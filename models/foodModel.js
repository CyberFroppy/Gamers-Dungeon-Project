const mongoose = require("mongoose");

const foodsCollectionSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const foodsCollection = mongoose.model("foods", foodsCollectionSchema);

const Foods = {
    addFood: async function(newFood) {
        return foodsCollection
            .create(newFood)
            .then(createdFood => createdFood);
    },
    getFoods: async function() {
        return foodsCollection
            .find()
            .then(foods => foods);
    },
    getFoodById: async function(id) {
        return foodsCollection
            .findOne({id:id})
            .then(food => food);
    },
    removeFoodById: async function(foodId) {
        return foodsCollection
            .deleteOne({
                id: foodId
            })
            .then(deleted => deleted);
    },
    updateFood: async function(foodId, newInfo) {
        return foodsCollection
            .findOneAndUpdate({
                id: foodId
            }, newInfo, {
                new: true
            })
            .then(updatedFood => updatedFood);
    }
};

module.exports = {
    Foods
};
