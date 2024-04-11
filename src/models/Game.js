const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    status: { type: String, enum: ['waiting', 'playing', 'done'], default: 'waiting' },
    maxPlayers: { type: Number, default: 5 }  // Пример добавления количества игроков
});

module.exports = mongoose.model('Game', gameSchema);
