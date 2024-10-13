/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true  // Remove the white spaces

    },
    duration : {
        type: Number,
        required: [true, 'A tour must have a duration']

    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have the group size']
    },

    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },

    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },

    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },

    discountDiscount: Number,
    summary: {
        type: String,
        trim: true,  // Remove the white spaces
        required: [true, 'A tour must have the summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have the cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates:[Date]

});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; 
