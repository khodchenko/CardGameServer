const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    status: { type: String, enum: ['waiting', 'playing', 'done'], default: 'waiting' },
    maxPlayers: { type: Number, default: 5 },
    createdAt: { type: Date, default: Date.now }, // Время создания игры
    endedAt: { type: Date }  // Время окончания игры, изначально не установлено
}, {
    timestamps: true  // Автоматически добавляет поля createdAt и updatedAt
});

module.exports = mongoose.model('Game', gameSchema);
