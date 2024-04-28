const express = require('express');
const { app, server, socketIO } = require('./services/socket');
const db = require('./services/db');

const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const pkg = require('@clerk/clerk-sdk-node');
const clerkClient = pkg.default;

const PORT = process.env.PORT || 5001;
const SOCKET_URL = 'http://localhost:5001';

app.use(bodyParser.json());

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "docker") {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    });
    app.use(cors({ origin: 'https://sunriseseniorservices.fun' }));
} else {
    app.use(cors())
}

const jobListingRouter = require('./routes/joblisting');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
app.use('/joblisting', jobListingRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});