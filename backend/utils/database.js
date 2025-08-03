const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı');
  } catch (error) {
    console.error('MongoDB bağlantı kapatma hatası:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
