const express = require('express');
const router = express.Router();
const { registerPlayer, getPlayers } = require('../controllers/playerController');

router.post('/register', registerPlayer);
router.get('/', getPlayers);

module.exports = router;
