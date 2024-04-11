const Player = require('../models/Player');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerPlayer = async (req, res) => {
    const { username, password, nickname, image } = req.body;
    try {
        const existingPlayer = await Player.findOne({ username });
        if (existingPlayer) {
            return res.status(400).json({ error: "Username already exists" });
        }
        const player = new Player({ username, password, nickname, image: image || 'default.png' }); // Предоставьте значение по умолчанию для изображения
        await player.save();

        const token = jwt.sign({ id: player._id }, process.env.JWT_SECRET || 'fallbacksecret', { expiresIn: '1h' }); // Используйте значение по умолчанию, если переменная среды не задана
        req.session.token = token;  // Сохраните токен в сессии
        res.status(201).json({ token });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Error registering player" });
    }
};

exports.loginPlayer = async (req, res) => {
    const { username, password } = req.body;
    try {
        const player = await Player.findOne({ username });
        if (!player) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, player.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: player._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
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
