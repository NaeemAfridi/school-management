import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load env variables

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectDB(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Database Connected Successfully");
  } catch (error: unknown) {
    console.log("Connection Failed", error);
    process.exit(1);
  }
}

export default connectDB;
