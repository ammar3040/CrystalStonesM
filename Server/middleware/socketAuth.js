const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` });

const SECRET_KEY = process.env.SECRET_KEY || 'fallback_dev_key_only';

const socketAuthentication = (socket, next) => {
    try {
        // 1) Token from socket.io auth object (preferred for browser clients)
        const tokenFromAuth = socket.handshake?.auth?.token;

        // 2) Fallback: Authorization header
        const rawAuthHeader = socket.handshake?.headers?.authorization;
        const tokenFromHeader = rawAuthHeader && rawAuthHeader.startsWith('Bearer ')
            ? rawAuthHeader.slice(7)
            : null;

        const token = tokenFromAuth || tokenFromHeader;

        if (!token) {
            console.warn('Socket auth: no token provided');
            return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, SECRET_KEY);

        if (!decoded) {
            return next(new Error('Authentication error: Invalid token'));
        }

        // Attach user payload to socket
        socket.user = decoded;
        return next();
    } catch (err) {
        console.error('Socket authentication error:', err.message);
        return next(new Error('Authentication error: Invalid or expired token'));
    }
};

module.exports = socketAuthentication;
