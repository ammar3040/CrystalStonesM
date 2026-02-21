const ChatModel = require('../models/ChatModel');
const MessageModel = require('../models/MessageModel');
const UserModel = require('../models/UserModel');

// ============== USER APIs ==============

/**
 * GET /api/chat/help-center
 * User: Get or create their help center chat with admin
 */
exports.getHelpCenterChat = async (req, res) => {
    try {
        const userId = String(req.user.uid);
        const username = req.user.name || 'User';

        // Find existing help center chat for this user
        let chat = await ChatModel.findOne({
            isHelpCenter: true,
            members: userId
        }).populate('members', 'Uname email mobile role').lean();

        if (!chat) {
            // Find admin user
            const admin = await UserModel.findOne({ role: 'admin' }).select('_id');

            chat = await ChatModel.create({
                name: `Crystal-Store-Mart-Service-${username}`,
                members: admin ? [userId, admin._id] : [userId],
                isHelpCenter: true
            });

            chat = await ChatModel.findById(chat._id)
                .populate('members', 'Uname email mobile role').lean();
        }

        // Remove current user from members (only show the other party)
        const otherMembers = (chat.members || []).filter(m => String(m._id) !== userId);
        chat.members = otherMembers;

        return res.status(200).json({ success: true, chat });
    } catch (error) {
        console.error('getHelpCenterChat error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * GET /api/chat/:chatId/messages
 * Get all messages for a specific chat
 */
exports.getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = String(req.user.uid);

        if (!chatId) {
            return res.status(400).json({ success: false, message: 'Chat ID required' });
        }

        // Verify user is a member of this chat
        const chat = await ChatModel.findById(chatId).lean();
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        const isMember = chat.members.some(m => String(m) === userId);
        const isAdmin = req.user.role === 'admin';

        if (!isMember && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this chat' });
        }

        const messages = await MessageModel.find({ chat: chatId })
            .populate('sender', 'Uname email role')
            .sort({ createdAt: 1 })
            .lean();

        // Transform sender name for admin in help center chats
        const transformedMessages = messages.map(msg => {
            if (chat.isHelpCenter && msg.sender?.role === 'admin') {
                return {
                    ...msg,
                    sender: {
                        ...msg.sender,
                        Uname: 'Crystal Store Mart Service'
                    }
                };
            }
            return msg;
        });

        return res.status(200).json({ success: true, messages: transformedMessages });
    } catch (error) {
        console.error('getMessages error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * POST /api/chat/message
 * Send a message (REST fallback — also works via socket)
 */
exports.sendMessage = async (req, res) => {
    try {
        const { chatId, message } = req.body;
        const userId = String(req.user.uid);

        if (!chatId || !message || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Chat ID and message are required' });
        }

        // Verify user is a member of this chat
        const chat = await ChatModel.findById(chatId).lean();
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        const isMember = chat.members.some(m => String(m) === userId);
        const isAdmin = req.user.role === 'admin';

        if (!isMember && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized to send messages in this chat' });
        }

        const savedMessage = await MessageModel.create({
            content: message.trim(),
            sender: userId,
            chat: chatId
        });

        const populatedMessage = await MessageModel.findById(savedMessage._id)
            .populate('sender', 'Uname email role').lean();

        // Transform admin name
        if (chat.isHelpCenter && populatedMessage.sender?.role === 'admin') {
            populatedMessage.sender.Uname = 'Crystal Store Mart Service';
        }

        // Emit via Socket.IO if available
        const io = req.app.get('io');
        if (io) {
            io.to(chatId).emit('NEW_MESSAGE', { chatId, message: populatedMessage });
            io.to(chatId).emit('NEW_MESSAGE_ALERT', { chatId });
        }

        return res.status(201).json({ success: true, message: populatedMessage });
    } catch (error) {
        console.error('sendMessage error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ============== ADMIN APIs ==============

/**
 * GET /api/chat/admin/chats
 * Admin: Get all help center chats (list of all users who have chatted)
 */
exports.adminGetAllHelpCenterChats = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const { page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const perPage = Math.max(parseInt(limit, 10) || 20, 1);

        const query = { isHelpCenter: true };

        const chats = await ChatModel.find(query)
            .populate('members', 'Uname email mobile role')
            .sort({ updatedAt: -1 })
            .skip((pageNum - 1) * perPage)
            .limit(perPage)
            .lean();

        const totalCount = await ChatModel.countDocuments(query);

        // For each chat, get the last message for preview
        const chatsWithLastMessage = await Promise.all(chats.map(async (chat) => {
            const lastMessage = await MessageModel.findOne({ chat: chat._id })
                .sort({ createdAt: -1 })
                .select('content sender createdAt')
                .populate('sender', 'Uname role')
                .lean();

            // Filter out admin from members to show the user name
            const userMember = (chat.members || []).find(m => m.role !== 'admin');

            return {
                ...chat,
                lastMessage: lastMessage ? {
                    content: lastMessage.content,
                    senderName: lastMessage.sender?.role === 'admin' ? 'You' : lastMessage.sender?.Uname,
                    createdAt: lastMessage.createdAt
                } : null,
                userName: userMember?.Uname || 'Unknown User',
                userEmail: userMember?.email || '',
                userMobile: userMember?.mobile || ''
            };
        }));

        return res.status(200).json({
            success: true,
            chats: chatsWithLastMessage,
            totalCount,
            totalPages: Math.ceil(totalCount / perPage),
            currentPage: pageNum
        });
    } catch (error) {
        console.error('adminGetAllHelpCenterChats error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * POST /api/chat/admin/start-chat
 * Admin: Get or create help center chat for a specific user
 */
exports.adminGetOrCreateChat = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const targetUser = await UserModel.findById(userId).select('Uname role');
        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Find existing help center chat for this user
        let chat = await ChatModel.findOne({
            isHelpCenter: true,
            members: userId
        }).populate('members', 'Uname email mobile role').lean();

        if (!chat) {
            const adminId = req.user.uid;

            chat = await ChatModel.create({
                name: `Crystal-Store-Mart-Service-${targetUser.Uname || 'User'}`,
                members: [userId, adminId],
                isHelpCenter: true
            });

            chat = await ChatModel.findById(chat._id)
                .populate('members', 'Uname email mobile role').lean();
        }

        return res.status(200).json({ success: true, chat });
    } catch (error) {
        console.error('adminGetOrCreateChat error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
