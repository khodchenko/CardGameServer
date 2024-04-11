// middleware/auth.js или в том файле, где вы определили ensureAuthenticated

const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const token = req.session.token; // Убедитесь, что токен сохраняется именно так
    if (!token) {
        return res.redirect('/players/login');  // Проверьте, что путь редиректа указан верно
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.redirect('/players/login');
    }
};

module.exports = ensureAuthenticated;
