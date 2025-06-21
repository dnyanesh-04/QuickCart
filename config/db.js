import mongoose from "mongoose";

let cached = global.mongoose; //Checks if there’s already a cached connection stored on the global object


if (!cached) { // If no cached object is found, create one
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {  
  if (cached.conn) return cached.conn; // If the connection already exists, return it immediately

  if (!cached.promise) { // If a connection hasn’t already been initiated, start it.
    const opts = { bufferCommands: false };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => mongoose); //Connects to MongoDB using the URI from environment variables
  }

  cached.conn = await cached.promise; // Waits for the connection promise to resolve and assigns it to cached.conn
  return cached.conn;
}
export default connectDB;