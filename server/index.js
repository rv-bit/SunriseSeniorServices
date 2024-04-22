const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SOCKET_URL = process.env.VITE_SOCKET_URL || 'http://localhost:3000';

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/dist'));
}

const http = require('http').Server(app);
const cors = require('cors');
app.use(cors())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const socketIO = require('socket.io')(http, {
    cors: {
        origin: SOCKET_URL
    }
});

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});