const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    score: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 }
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;