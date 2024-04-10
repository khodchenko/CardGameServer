const Game = require('../models/Game');

exports.getGames = async (req, res) => {
    try {
        const games = await Game.find({});
        res.json(games);
    } catch (error) {
        console.error("Failed to retrieve games:", error);
        res.status(500).json({ error: "Failed to retrieve games" });
    }
};

exports.createGame = async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: "Name is required" });
    }
    try {
        const newGame = new Game({
            name: req.body.name,
            players: [],
            status: 'waiting',
            maxPlayers: 4
        });
        await newGame.save();
        res.status(201).json(newGame);
    } catch (error) {
        console.error("Failed to create game:", error);
        res.status(500).json({ error: "Failed to create game" });
    }
};

exports.joinGame = async (req, res) => {
    if (!req.body.playerId) {
        return res.status(400).json({ error: "Player ID is required" });
    }
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }
        if (game.players.length >= game.maxPlayers || game.status !== 'waiting') {
            return res.status(400).json({ error: 'Game is full or already started' });
        }
        game.players.push(req.body.playerId);
        await game.save();
        res.json(game);
    } catch (error) {
        console.error("Failed to join game:", error);
        res.status(500).json({ error: "Failed to join game" });
    }
};
