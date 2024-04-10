    const express = require('express');
    const cookieParser = require('cookie-parser');

    const app = express();
    const port = process.env.PORT || 3000;

    // Подключение к базе данных
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/card_game_db')
        .then(() => console.log('MongoDB connected successfully.'))
        .catch(err => console.error('MongoDB connection error:', err));

    // Middleware
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());

    // Импорт маршрутов
    const gameRoutes = require('./routes/gameRoutes');
    app.use('/game', gameRoutes);

    // Базовый маршрут для проверки работоспособности
    app.get('/', (req, res) => {
        res.send('<h1>Welcome to the Card Game API!</h1><p>Use /game to access game routes.</p>');
    });
    // Обработка несуществующих маршрутов
    app.use((req, res, next) => {
        res.status(404).send({ error: "Route not found" });
    });


    // Запуск сервера
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
