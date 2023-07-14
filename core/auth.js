const jwt = require('jsonwebtoken');

function generateToken(payload) {
    const token = jwt.sign(payload, 'jsonauth', { expiresIn: '1h' });
    return token;
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'jsonauth', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

module.exports = {
    generateToken,
    verifyToken,
};