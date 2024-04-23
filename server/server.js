const express = require('express');
const { app, server, socketIO } = require('./services/socket');

const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 3000;
const SOCKET_URL = 'http://localhost:3000';

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/dist'));
}

if (process.env.NODE_ENV === 'production') {
    app.use(cors({ origin: 'https://sunriseseniorservices.fun' }));
} else {
    app.use(cors())
}

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});