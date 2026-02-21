const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const { strictLimiter } = require('../middleware/rateLimiter');

// All chat routes require JWT authentication
router.use(authMiddleware);

// Apply rate limiting to all chat routes
router.use(strictLimiter);

// ============== USER ROUTES ==============
// User: Get or create help center chat with admin
router.get('/help-center', chatController.getHelpCenterChat);

// Get messages for a specific chat
router.get('/:chatId/messages', chatController.getMessages);

// Send a message (REST endpoint — also works via socket)
router.post('/message', chatController.sendMessage);

// ============== ADMIN ROUTES ==============
// Admin: Get all help center chats (user list with last message preview)
router.get('/admin/chats', chatController.adminGetAllHelpCenterChats);

// Admin: Get or create help center chat for a specific user
router.post('/admin/start-chat', chatController.adminGetOrCreateChat);

module.exports = router;
