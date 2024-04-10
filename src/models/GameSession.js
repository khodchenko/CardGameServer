const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSessionSchema = new Schema({
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    gameStatus: { type: String, enum: ['waiting', 'in_progress', 'completed'], default: 'waiting' },
    winner: { type: Schema.Types.ObjectId, ref: 'Player', default: null },
    turns: [{ player: { type: Schema.Types.ObjectId, ref: 'Player' }, cardPlayed: { type: Schema.Types.ObjectId, ref: 'Card' } }]
}, { timestamps: true });

const GameSession = mongoose.model('GameSession', gameSessionSchema);

module.exports = GameSession;