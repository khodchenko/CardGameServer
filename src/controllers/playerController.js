const Player = require('../models/Player');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerPlayer = async (req, res) => {
    const { email, password, nickname, image } = req.body;
    try {
        const existingPlayer = await Player.findOne({ email });
        if (existingPlayer) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const player = new Player({ email, password, nickname, image });
        await player.save();

        const token = jwt.sign({ id: player._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Error registering player" });
    }
};

exports.loginPlayer = async (req, res) => {
    const { email, password } = req.body;
    try {
        const player = await Player.findOne({ email });
        if (!player) {
            return res.status(404).json({ error: "Email not found" });
        }

        const isMatch = await bcrypt.compare(password, player.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Создание токена
        const token = jwt.sign({ id: player._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Сохранение токена в сессии
        req.session.token = token;
        req.session.user = player;

        // Редирект на страницу со списком игр после успешного входа
        res.redirect('/game');
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during authentication" });
    }
};


exports.getPlayers = async (req, res) => {
    try {
        const players = await Player.find().select("-password");
        res.json(players);
    } catch (error) {
        console.error("Error fetching players:", error);
        res.status(500).json({ error: "Server error" });
    }
};
