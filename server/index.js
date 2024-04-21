const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/dist'));
}

const cors = require('cors');
app.use(cors())

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    // res.send('Hello World');
});