import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('blogSummariser');

export async function saveFullText(url: string, fullText: string) {
  await client.connect();
  const collection = db.collection('blogs');
  await collection.insertOne({ url, fullText });
}
