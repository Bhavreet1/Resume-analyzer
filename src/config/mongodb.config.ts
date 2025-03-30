import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "your_mongodb_connection_string";
const client = new MongoClient(uri);

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db("your_database_name");
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const db = client.db("your_database_name"); 