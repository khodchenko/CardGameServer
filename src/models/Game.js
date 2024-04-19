// models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    status: { type: String, enum: ['waiting', 'playing', 'done'], default: 'waiting' },
    createdAt: { type: Date, default: Date.now },
    startedAt: { type: Date },
    endedAt: { type: Date },
    maxPlayers: { type: Number, default: 4 }
});

module.exports = mongoose.model('Game', gameSchema);
