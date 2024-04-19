const express = require('express');
const http = require("http");
const socketIO = require("socket.io");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const Game = require('./models/Game');
const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');

const app = express();
const server = http.createServer(app);  // Создаем HTTP сервер на базе express
const io = socketIO(server);           // Подключаем socket.io к серверу
const port = process.env.PORT || 3000;

app.set("port", port);
app.use("/static", express.static(__dirname + "/static"));
app.use(express.static('public'));

require('dotenv').config();
console.log("Using JWT Secret:", process.env.JWT_SECRET);

app.set('view engine', 'ejs');
app.set('views', 'views');

mongoose.connect('mongodb://localhost/cardGameDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: "verysecretkey12345",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  //todo Для HTTPS установите true
}));

app.use('/game', gameRoutes);
app.use('/players', playerRoutes);

app.get('/', async (req, res) => {
    try {
        const games = await Game.find();
        res.render('index', {
            games: games,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error loading games:', error);
        res.status(500).send('Server Error ' + error);
    }
});

app.use((req, res) => {
    res.status(404).send({error: "Route not found"});
});

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('joinGame', async ({ gameId, userId }) => {
        try {
            const game = await Game.findById(gameId);
            if (game && game.status === 'waiting' && !game.players.includes(userId)) {
                game.players.push(userId); // Добавляем пользователя в список игроков
                await game.save(); // Сохраняем изменения
                socket.join(gameId); // Присоединяем сокет к комнате игры
                io.to(gameId).emit('updatePlayers', game.players); // Отправляем всем в комнате обновлённый список игроков
                console.log(`User ${userId} joined game ${gameId}`);
            }
        } catch (error) {
            console.error('Error joining game:', error);
        }
    });

    socket.on('leaveGame', async (gameId, userId) => {
        try {
            const game = await Game.findById(gameId);
            if (game) {
                game.players = game.players.filter(playerId => playerId.toString() !== userId.toString());
                await game.save();
                socket.leave(gameId);
                io.to(gameId).emit('updatePlayers', game.players); // Обновляем список игроков после выхода одного из них
            }
        } catch (error) {
            console.error('Error leaving game:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
