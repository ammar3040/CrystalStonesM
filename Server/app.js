const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const database = require("./config/db");
const Routeroutes = require("./routes/index");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
require('./config/passportConfig')(passport);
require('./config/passport-google')(passport);

const cors = require("cors");
const jwt = require('jsonwebtoken');
const path = require("path");

// Socket.IO imports
const { NEW_MESSAGE, NEW_MESSAGE_ALERT, JOIN_ROOM, LEAVE_ROOM, ONLINE_USERS, START_TYPING, STOP_TYPING, USER_STATUS_CHANGED } = require("./utils/events");
const MessageModel = require("./models/MessageModel");
const ChatModel = require("./models/ChatModel");
const UserModel = require("./models/UserModel");
const socketAuthentication = require("./middleware/socketAuth");
const { globalLimiter } = require("./middleware/rateLimiter");

require('dotenv').config({ path: `${__dirname}/.env` });
const port = process.env.PORT;

const app = express();

app.use(session({
  secret: `${process.env.SECRET_KEY}`,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apply global rate limiter (DDoS protection)
app.use(globalLimiter);

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list or is a localhost/loopback
    const isAllowed = allowedOrigins.includes(origin) ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1');

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
};

app.use(cors(corsOptions));

app.use("/", Routeroutes);

// --- Create HTTP server ---
const server = createServer(app);

// --- Socket.IO setup ---
const io = new Server(server, {
  cors: corsOptions
});

// Make io accessible in controllers via req.app.get('io')
app.set("io", io);

// --- Socket.IO state ---
const userSocketIDs = new Map();
const onlineUsers = new Set();

// --- Socket.IO authentication ---
io.use(socketAuthentication);

// --- Socket.IO events ---
io.on("connection", (socket) => {
  const user = socket.user;
  const userId = user.uid.toString();
  const isFirstConnection = !userSocketIDs.has(userId);

  if (isFirstConnection) {
    userSocketIDs.set(userId, new Set());
    onlineUsers.add(userId);
    socket.broadcast.emit(USER_STATUS_CHANGED, { userId, status: 'online' });
  }

  userSocketIDs.get(userId).add(socket.id);
  socket.emit(ONLINE_USERS, Array.from(onlineUsers));

  // Join a chat room
  socket.on(JOIN_ROOM, ({ chatId }) => {
    if (!chatId) return;
    socket.join(chatId);
  });

  // New message via socket
  socket.on(NEW_MESSAGE, async ({ chatId, message }) => {
    try {
      if (!chatId || !message) return;

      const [chat, savedMessage] = await Promise.all([
        ChatModel.findById(chatId).lean(),
        MessageModel.create({
          content: message,
          sender: user.uid,
          chat: chatId,
        })
      ]);

      if (!chat) return;

      const messageForRealTime = {
        ...savedMessage._doc,
        sender: {
          _id: user.uid,
          Uname: (chat.isHelpCenter && user.role === 'admin') ? 'Crystal Store Mart Service' : user.name,
          role: user.role,
        },
        createdAt: new Date().toISOString(),
      };

      socket.to(chatId).emit(NEW_MESSAGE, { chatId, message: messageForRealTime });
      socket.to(chatId).emit(NEW_MESSAGE_ALERT, { chatId });

      // --- Auto-reply logic (similar to chatController.js) ---
      const messageCount = await MessageModel.countDocuments({ chat: chatId });
      if (messageCount === 1 && chat.isHelpCenter && user.role !== 'admin') {
        const admin = await UserModel.findOne({ role: 'admin' }).select('_id');
        if (admin) {
          const autoReplyContent = "Welcome to Crystal Store Mart. We will reply to you as soon as possible. If you can't get a reply, contact us on WhatsApp number +91 90165 07258. Thank you for your effort.";

          const autoReply = await MessageModel.create({
            content: autoReplyContent,
            sender: admin._id,
            chat: chatId
          });

          const populatedAutoReply = await MessageModel.findById(autoReply._id)
            .populate('sender', 'Uname email role').lean();

          if (populatedAutoReply.sender) {
            populatedAutoReply.sender.Uname = 'Crystal Store Mart Service';
          }

          io.to(chatId).emit(NEW_MESSAGE, { chatId, message: populatedAutoReply });
          io.to(chatId).emit(NEW_MESSAGE_ALERT, { chatId });
        }
      }
    } catch (err) {
      console.error('Socket NEW_MESSAGE error:', err);
    }
  });

  // Typing indicators
  socket.on(START_TYPING, ({ chatId }) => {
    if (!chatId) return;
    socket.to(chatId).emit(START_TYPING, { chatId, userId });
  });

  socket.on(STOP_TYPING, ({ chatId }) => {
    if (!chatId) return;
    socket.to(chatId).emit(STOP_TYPING, { chatId, userId });
  });

  // Leave room
  socket.on(LEAVE_ROOM, ({ chatId }) => {
    if (!chatId) return;
    socket.leave(chatId);
  });

  // Disconnect
  socket.on("disconnect", () => {
    const userSockets = userSocketIDs.get(userId);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        userSocketIDs.delete(userId);
        onlineUsers.delete(userId);
        io.emit(USER_STATUS_CHANGED, { userId, status: 'offline' });
      }
    }
  });
});

// --- Start server ---
server.listen(port, "0.0.0.0", () => {
  console.log("Server is running on port " + port);
});