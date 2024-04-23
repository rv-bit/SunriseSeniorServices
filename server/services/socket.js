const express = require('express');
const app = express();

const server = require('http').Server(app);

const socketIO = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

module.exports = {
    socketIO,
    server,
    app
}