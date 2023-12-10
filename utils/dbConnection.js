import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error(
    "Please define the MONGODB_URL environment variable inside .env.local"
  );
}

let connectionCache = global.mongoose;

if (!connectionCache) {
  connectionCache = global.mongoose = { conn: null, promise: null };
}

const dbConnection = async () => {
  if (connectionCache.conn) {
    return connectionCache.conn;
  }

  if (!connectionCache.promise) {
    const options = {
      bufferCommands: false,
    };

    connectionCache.promise = mongoose
      .connect(MONGODB_URL, options)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    connectionCache.conn = await connectionCache.promise;
  } catch (error) {
    connectionCache.promise = null;
    throw error;
  }

  return connectionCache.conn;
};

export default dbConnection;
