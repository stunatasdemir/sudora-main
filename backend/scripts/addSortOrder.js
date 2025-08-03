const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const addSortOrderToProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');

    // Find all products without sortOrder
    const products = await Product.find({ 
      $or: [
        { sortOrder: { $exists: false } },
        { sortOrder: null }
      ]
    }).sort({ createdAt: 1 });

    console.log(`${products.length} ürün bulundu, sortOrder değerleri atanıyor...`);

    // Update each product with sortOrder
    for (let i = 0; i < products.length; i++) {
      await Product.findByIdAndUpdate(products[i]._id, { sortOrder: i });
      console.log(`${i + 1}/${products.length} - ${products[i].name} güncellendi`);
    }

    console.log('Tüm ürünlerin sortOrder değerleri başarıyla atandı!');
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı');
  }
};

// Script'i çalıştır
addSortOrderToProducts();
