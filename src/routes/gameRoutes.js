const express = require('express');
const router = express.Router();

const GameController = require('../controllers/GameController');

router.get('/', GameController.getGames);
router.post('/create', GameController.createGame);
router.post('/join', GameController.joinGame);
router.post('/move', GameController.makeMove);

module.exports = router;