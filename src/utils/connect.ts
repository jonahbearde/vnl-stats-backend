import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();
const client = new MongoClient(process.env.MONGO_URI ?? '', { connectTimeoutMS: 5000 });

export const connect = async () => {
  await client.connect()
  await client.db().command({ ping: 1 })
  console.log('db connected');
}

export const db = client.db();