const mongoose = require('mongoose');

const { Schema } = mongoose;

const SocketSchema = new Schema({
    createTime: { type: Date, default: Date.now },

    id: { // socket.id
        type: String,
        unique: true,
        index: true,
    },
    user: {
        type: String,
        ref: 'user',
        index: true,
    },
    ip: {
        type: String,
    },
    os: {
        type: String,
        default: '',
    },
    browser: {
        type: String,
        default: '',
    },
    environment: {
        type: String,
        default: '',
    },
});

const Socket = mongoose.model('Socket', SocketSchema);
module.exports = Socket