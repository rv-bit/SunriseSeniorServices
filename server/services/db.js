const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const { MongoClient } = require('mongodb');
const url = process.env.MONGODB_URI;

const client = new MongoClient(url)
const connect = async () => {
    await client.connect();
    console.log('Connected to MongoDB');
}
connect();

module.exports = client.db('SunriseSeniorServices');