const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    content: {
        type: String,
        trim: true,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    chat: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Chat'
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
