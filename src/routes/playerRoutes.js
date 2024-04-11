const express = require('express');
const router = express.Router();
const { registerPlayer, loginPlayer, getPlayers } = require('../controllers/playerController');

router.get('/login', (req, res) => {
    res.render('login');  // Убедитесь, что файл login.ejs существует в папке views
});

router.get('/register', (req, res) => {
    res.render('register');  // Убедитесь, что файл register.ejs существует
});

router.post('/login', loginPlayer);
router.post('/register', registerPlayer);
router.get('/', getPlayers);

module.exports = router;
