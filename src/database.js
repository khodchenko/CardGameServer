const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cardGameDB', {
    // удалены useNewUrlParser и useUnifiedTopology
})
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));