const rateLimit = require('express-rate-limit');

// Global limiter: 500 requests per 15 minutes per IP
// (Increased from 100 to support normal SPA initial page-load fetches)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
        success: false,
        message: 'Too many requests from this IP. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for sensitive APIs (cart, chat): 100 requests per 1 minute per IP
// (Increased from 30 for smoother interaction and debugging)
const strictLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Request limit reached. Please wait a moment.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth limiter for login/OTP attempts: 20 requests per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { globalLimiter, strictLimiter, authLimiter };
