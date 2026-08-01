import dns from 'dns';
import mongoose from 'mongoose';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const uri = 'mongodb+srv://tourhelpdeskinc_db_user:UvYPGYWLS4SXDz07@tourhelpdesk.w873nv3.mongodb.net/?retryWrites=true&w=majority&appName=tourhelpdesk';

async function testMongoose() {
  console.log("Connecting to MongoDB Atlas with DNS fallback...");
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("✅ MongoDB Atlas Connected Successfully!");
    console.log("📊 Database Name:", mongoose.connection.name);
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
}

testMongoose();
