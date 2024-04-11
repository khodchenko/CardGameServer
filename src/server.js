const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const Game = require('./models/Game');

require('dotenv').config();
console.log("Using JWT Secret:", process.env.JWT_SECRET);

// Установка EJS как шаблонизатора
app.set('view engine', 'ejs');
app.set('views', 'views');

// Подключение к MongoDB
mongoose.connect('mongodb://localhost/cardGameDB')
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

// Настройка сессии
app.use(session({
    secret: "verysecretkey12345",  //todo Используйте переменные окружения для секретов
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false} //todo Для HTTPS установите true
}));

// Роуты
const gameRoutes = require('./routes/gameRoutes');
app.use('/game', gameRoutes);

const playerRoutes = require('./routes/playerRoutes');
app.use('/players', playerRoutes);

// Главная страница с перечнем игр
app.get('/', async (req, res) => {
    try {
        const games = await Game.find();
        res.render('index', {
            games: games,
            user: req.session.user
        });
    } catch (error) {
        res.status(500).send('Server Error ' + error);
    }
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
    res.status(404).send({error: "Route not found"});
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
