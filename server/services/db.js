const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const { MongoClient } = require('mongodb');
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!url) {
    console.error('MongoDB URL is not provided. Please provide it in .env file');
    process.exit(1);
}

if (!dbName) {
    console.error('MongoDB Database Name is not provided. Please provide it in .env file');
    process.exit(1);
}

const client = new MongoClient(url)
const connect = async () => {
    await client.connect();
    console.log('Connected to MongoDB');
}
connect();

module.exports = client.db(process.env.MONGODB_DB_NAME);