import mongoose from 'mongoose';
import env from './env.js';
import logger from './logger.js';

export const connectDB = async (): Promise<typeof mongoose | undefined> => {
  if (!env.MONGO_URI) {
    logger.warn('⚠️ MONGO_URI is missing. Database endpoints will not function.');
    return;
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      maxPoolSize: env.DB_MAX_POOL_SIZE,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    const host = conn.connection.host || 'MongoDB Atlas Cluster';
    const dbName = conn.connection.name || 'tourhelpdesk';

    logger.info(`✅ MongoDB Connected Successfully! [Host: ${host} | Database: ${dbName}]`);
    return conn;
  } catch (error: any) {
    logger.error(`❌ MongoDB connection failed: ${error?.message || error}`);
    logger.warn('⚠️ Server will continue, but database operations will return error responses');
  }
};


mongoose.connection.on('disconnected', () => logger.warn('⚠️ MongoDB disconnected'));
mongoose.connection.on('error', (err) => logger.error('❌ MongoDB connection error:', err));
mongoose.connection.on('reconnected', () => logger.info('✅ MongoDB reconnected'));

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    logger.info('🔌 MongoDB connection closed cleanly');
  }
};
