const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const ensureAuthenticated = require('../middleware/auth');

router.get('/', gameController.getGames);
router.get('/:id', ensureAuthenticated, gameController.getGame);
router.post('/create', gameController.createGame);
router.post('/join/:id', gameController.joinGame);
router.patch('/:id/updateStatus', gameController.updateStatus);

module.exports = router;
