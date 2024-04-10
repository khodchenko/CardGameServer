const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    suit: { type: String, enum: ['hearts', 'diamonds', 'clubs', 'spades'], required: true },
    number: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;