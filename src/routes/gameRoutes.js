const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const gameController = require('../controllers/gameController');
const ensureAuthenticated = require('../middleware/auth');

// Получение списка всех игр
router.get('/', gameController.getGames);

// Получение конкретной игры по ID
router.get('/:id', ensureAuthenticated, gameController.getGame);

// Создание новой игры
router.post('/create', ensureAuthenticated, async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    try {
        const newGame = new Game({
            name,
            players: [req.session.user._id], // Создатель игры автоматически добавляется в список игроков
            status: 'waiting'
        });
        await newGame.save();
        res.json({ game: newGame });
    } catch (error) {
        console.error('Failed to create game:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Присоединение к игре
router.post('/join/:id', gameController.joinGame);

// Обновление статуса игры
router.patch('/:id/updateStatus', gameController.updateStatus);

// Покидание игры
router.get('/:id/leave', ensureAuthenticated, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        game.players = game.players.filter(playerId => playerId.toString() !== req.session.user._id.toString());
        await game.save();
        res.redirect('/'); // Возвращаем пользователя на главную страницу
    } catch (error) {
        console.error("Error leaving game:", error);
        res.status(500).send(error.message);
    }
});

module.exports = router;
