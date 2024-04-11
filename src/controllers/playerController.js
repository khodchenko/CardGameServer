const Player = require('../models/Player');
const bcrypt = require('bcryptjs');

exports.registerPlayer = async (req, res) => {
    const { username, password, nickname, image } = req.body;
    try {
        let player = await Player.findOne({ username });
        if (player) {
            return res.status(400).json({ error: "Username already exists", field: "username" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        player = new Player({
            username,
            password: hashedPassword,
            nickname,
            image
        });
        await player.save();
        res.status(201).json({ message: "Player registered successfully", player: {
                id: player._id,
                username: player.username,
                nickname: player.nickname,
                image: player.image
            }});
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error during registration", details: error.message });
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
