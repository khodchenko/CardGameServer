const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/', gameController.getGames);
router.get('/:id', gameController.getGame);
router.post('/create', gameController.createGame);
router.post('/join/:id', gameController.joinGame);
router.patch('/updateStatus/:id', gameController.updateStatus);

module.exports = router;
