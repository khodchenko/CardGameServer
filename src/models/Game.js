const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    status: { type: String, enum: ['waiting', 'playing', 'done'], default: 'waiting' },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);