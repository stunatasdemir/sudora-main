const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('./utils/database');

// Load environment variables
dotenv.config();

const testConnection = async () => {
  console.log('MongoDB bağlantısı test ediliyor...');
  console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Tanımlı' : 'Tanımsız');
  
  try {
    await connectDB();
    console.log('✅ MongoDB bağlantısı başarılı!');
    await disconnectDB();
    console.log('✅ Test tamamlandı');
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  }
};

testConnection();
