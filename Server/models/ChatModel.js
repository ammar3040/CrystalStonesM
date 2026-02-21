const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    isHelpCenter: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
