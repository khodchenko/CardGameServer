const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    players: [String], // Список игроков
    status: { type: String, default: 'waiting' }, // Статус игры
    winner: String // Победитель игры
});

module.exports = mongoose.model('Game', gameSchema);