const express = require('express');
const { app, server, socketIO } = require('./services/socket');
const db = require('./services/db');

const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5001;
const SOCKET_URL = 'http://localhost:5001';

app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/dist'));
}

if (process.env.NODE_ENV === 'production') {
    app.use(cors({ origin: 'https://sunriseseniorservices.fun' }));
} else {
    app.use(cors())
}

const jobListingRouter = require('./routes/joblisting');
app.use('/job-listings', jobListingRouter);

app.get('/', (req, res) => {
    console.log('GET /');

    res.json({
        message: 'GET /'
    });

    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    }
});

app.post('/saveUser', (req, res) => {
    console.log('GET /saveUser');
    const formData = req.body.formData;

    // Now you can use formData
    console.log(formData);

    // Send a response back to the client
    res.send('User data received');
})

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
