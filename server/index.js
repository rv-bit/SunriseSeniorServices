const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/dist'));
}

const http = require('http').Server(app);
const cors = require('cors');
app.use(cors())

app.get('/', (req, res) => {
    // res.send('Hello World');
});

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
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