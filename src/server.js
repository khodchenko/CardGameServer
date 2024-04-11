const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const Game = require('./models/Game');

app.set('view engine', 'ejs');  // Указываем, что используем EJS как шаблонизатор
app.set('views', 'views');      // Указываем директорию с шаблонами

mongoose.connect('mongodb://localhost/cardGameDB')
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const gameRoutes = require('./routes/gameRoutes');
app.use('/game', gameRoutes);

const playerRoutes = require('./routes/playerRoutes');
app.use('/players', playerRoutes);

app.get('/', async (req, res) => {
    try {
        const games = await Game.find();  // Получаем все игры из базы данных
        res.render('index', { games });   // Рендерим страницу index.ejs с данными игр
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

app.use((req, res) => {
    res.status(404).send({ error: "Route not found" });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
