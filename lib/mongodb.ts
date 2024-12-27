import { MongoClient } from "mongodb";
import config from "./config";
export default async function connectToDatabase() {
  const client = new MongoClient(config.mongodbURI);
  try {
    await client.connect();
    return client.db();
  } catch (error) {
    console.error("Error connecting to MongoDb:", error);
    throw error;
  }
}
