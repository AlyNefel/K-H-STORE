import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not defined in environment. Running with local memory storage fallback.');
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ Connected successfully to MongoDB Atlas (K&H Database)');
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
    console.warn('⚠️ Fallback storage active while database reconnects.');
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
