const express = require('express');
const { app, server, socketIO } = require('./services/socket');
const db = require('./services/db');

const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 5001;
const SOCKET_URL = 'http://localhost:5001';

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/dist'));
}

if (process.env.NODE_ENV === 'production') {
    app.use(cors({ origin: 'https://sunriseseniorservices.fun' }));
} else {
    app.use(cors())
}

const jobListingRouter = require('./routes/joblisting');
app.use('/api/job-listings', jobListingRouter);

app.get('/api', (req, res) => {
    console.log('GET /');
    res.json({
        message: 'GET /'
    });
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