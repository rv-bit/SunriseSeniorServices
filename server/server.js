const express = require('express');
const { app, server } = require('./services/socket');
const db = require('./services/db');

const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const history = require('express-history-api-fallback');

const PORT = process.env.PORT || 5001;
const SOCKET_URL = 'http://localhost:5001';

app.use(bodyParser.json());

const jobListingRouter = require('./routes/joblisting');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');

app.use('/joblisting', jobListingRouter);
app.use('/user', userRouter);
app.use('/chats', chatRouter);

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "docker") {
    app.use(cors({ origin: 'https://sunriseseniorservices.fun' }));
    const root = path.join(__dirname, '../frontend/dist');
    app.use(express.static(root));
    app.use(history('index.html', { root }));
} else {
    app.use(cors())
}

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});