const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Product, Category, Admin, Message } = require('../models');

// Load environment variables
dotenv.config();

// Sample categories
const categories = [
  {
    name: 'Radyo',
    description: 'Vintage ve modern radyo modelleri',
    icon: 'Radio',
    sortOrder: 1
  },
  {
    name: 'USB Mini',
    description: 'Kompakt USB nemlendirici modelleri',
    icon: 'Usb',
    sortOrder: 2
  },
  {
    name: "LED'li",
    description: 'LED ışıklı nemlendirici ve dekoratif ürünler',
    icon: 'Lightbulb',
    sortOrder: 3
  },
  {
    name: 'Seramik Hazneli',
    description: 'Seramik detaylı premium nemlendirici modelleri',
    icon: 'Droplets',
    sortOrder: 4
  },
  {
    name: 'Masa Lambası',
    description: 'Dekoratif masa lambası modelleri',
    icon: 'Lamp',
    sortOrder: 5
  }
];

// Sample products
const products = [
  {
    name: 'Vintage Şömineli Radyo',
    description: 'Klasik şömine tasarımını modern radyo teknolojisiyle birleştiren benzersiz ürün. El işçiliğiyle özenle hazırlanmış retro ahşap radyo, her köşesi düşünülmüş tasarımıyla dikkat çeker.',
    category: 'Radyo',
    imageUrl: '/placeholder.svg',
    images: ['/placeholder.svg'],
    material: 'Doğal ahşap, metal detaylar',
    dimensions: '25cm x 15cm x 12cm',
    colors: ['Kahverengi', 'Antik Beyaz'],
    specifications: {
      frequency: '60 Hz',
      warranty: '2 Yıl',
      voltage: '220-240 V',
      origin: 'TR',
      features: ['Retro tasarım', 'Yüksek ses kalitesi', 'Ahşap gövde'],
      bluetooth: 'Var',
      guaranteeType: 'İthalatçı Garantisi',
      importerGuarantee: '2 Yıl İthalatçı Garantisi'
    },
    safetyInfo: {
      ageRestriction: '12 yaş ve üzeri',
      warnings: ['Suya temas ettirmeyin', 'Çocukların erişemeyeceği yerde saklayın']
    },
    featured: true
  },
  {
    name: 'LED\'li Aroma Nemlendirici',
    description: '7 renk LED ışık özelliği ile atmosfer yaratıyor, aroma diffüzer fonksiyonlu. Sessiz çalışma teknolojisi ile gece kullanımına uygun.',
    category: "LED'li",
    imageUrl: '/placeholder.svg',
    images: ['/placeholder.svg'],
    material: 'ABS plastik, seramik',
    dimensions: '12cm x 12cm x 18cm',
    colors: ['Beyaz', 'Ahşap Görünümlü'],
    specifications: {
      frequency: '50 Hz',
      warranty: '1 Yıl',
      voltage: '5V USB',
      origin: 'CN',
      features: ['7 renk LED', 'Aroma diffüzer', 'Sessiz çalışma', 'Otomatik kapanma'],
      bluetooth: 'Yok',
      guaranteeType: 'Satıcı Garantisi',
      importerGuarantee: '1 Yıl Satıcı Garantisi'
    },
    safetyInfo: {
      ageRestriction: '8 yaş ve üzeri',
      warnings: ['Elektrikli cihazları suya temas ettirmeyin', 'Sadece önerilen voltajda kullanın']
    },
    featured: true
  },
  {
    name: 'USB Mini Nemlendirici',
    description: 'Kompakt tasarım, büyük etki. Ofis ve küçük alanlar için ideal. USB ile çalışır, sessiz motor teknolojisi.',
    category: 'USB Mini',
    imageUrl: '/placeholder.svg',
    images: ['/placeholder.svg'],
    material: 'PP plastik',
    dimensions: '8cm x 8cm x 12cm',
    colors: ['Beyaz', 'Pembe', 'Mavi'],
    specifications: {
      frequency: '50 Hz',
      warranty: '6 Ay',
      voltage: '5V USB',
      origin: 'CN',
      features: ['Kompakt tasarım', 'USB beslemeli', 'Sessiz motor', 'Taşınabilir'],
      bluetooth: 'Yok',
      guaranteeType: 'Satıcı Garantisi',
      importerGuarantee: '6 Ay Satıcı Garantisi'
    },
    safetyInfo: {
      ageRestriction: '12 yaş ve üzeri',
      warnings: ['USB kablosunu hasarlı iken kullanmayın', 'Su seviyesini kontrol edin']
    },
    featured: false
  },
  {
    name: 'Seramik Hazneli Premium Nemlendirici',
    description: 'Seramik detaylarla şık görünüm. Büyük kapasiteli su haznesi ile uzun süreli kullanım. Otomatik kapanma özelliği.',
    category: 'Seramik Hazneli',
    imageUrl: '/placeholder.svg',
    images: ['/placeholder.svg'],
    material: 'Seramik, ABS plastik',
    dimensions: '15cm x 15cm x 20cm',
    colors: ['Beyaz Seramik', 'Gri Seramik'],
    specifications: {
      frequency: '60 Hz',
      warranty: '2 Yıl',
      voltage: '220-240 V',
      origin: 'TR',
      features: ['Seramik detaylar', 'Büyük kapasite', 'Otomatik kapanma', 'Sessiz çalışma'],
      bluetooth: 'Yok',
      guaranteeType: 'İthalatçı Garantisi',
      importerGuarantee: '2 Yıl İthalatçı Garantisi'
    },
    safetyInfo: {
      ageRestriction: '15 yaş ve üzeri',
      warnings: ['Seramik parçalar kırılabilir', 'Düşürmeyin', 'Temizlik sırasında dikkatli olun']
    },
    featured: true
  },
  {
    name: 'Modern Ahşap Masa Lambası',
    description: 'Doğal ahşap gövde ile modern tasarım. Ayarlanabilir parlaklık seviyesi. USB şarj portu ile fonksiyonel kullanım.',
    category: 'Masa Lambası',
    imageUrl: '/placeholder.svg',
    images: ['/placeholder.svg'],
    material: 'Doğal ahşap, metal',
    dimensions: '20cm x 20cm x 35cm',
    colors: ['Doğal Ahşap', 'Koyu Ahşap'],
    specifications: {
      frequency: '50 Hz',
      warranty: '1 Yıl',
      voltage: '220-240 V',
      origin: 'TR',
      features: ['Doğal ahşap', 'Ayarlanabilir parlaklık', 'USB şarj portu', 'Modern tasarım'],
      bluetooth: 'Yok',
      guaranteeType: 'Üretici Garantisi',
      importerGuarantee: '1 Yıl Üretici Garantisi'
    },
    safetyInfo: {
      ageRestriction: '8 yaş ve üzeri',
      warnings: ['Ampulü değiştirirken elektriği kesin', 'Nemli ellerle dokunmayın']
    },
    featured: false
  },
  {
    name: 'Retro Bluetooth Radyo',
    description: 'Nostaljik tasarım, modern teknoloji. Bluetooth bağlantısı, FM/AM radyo, USB girişi. Vintage görünümde modern özellikler.',
    category: 'Radyo',
    imageUrl: '/placeholder.svg',
    images: ['/placeholder.svg'],
    material: 'Ahşap, metal, kumaş',
    dimensions: '30cm x 18cm x 15cm',
    colors: ['Kahverengi', 'Siyah'],
    specifications: {
      frequency: '60 Hz',
      warranty: '2 Yıl',
      voltage: '220-240 V',
      origin: 'CN',
      features: ['Bluetooth 5.0', 'FM/AM radyo', 'USB girişi', 'Retro tasarım', 'Yüksek ses kalitesi'],
      bluetooth: 'Bluetooth 5.0',
      guaranteeType: 'İthalatçı Garantisi',
      importerGuarantee: '2 Yıl İthalatçı Garantisi'
    },
    safetyInfo: {
      ageRestriction: '12 yaş ve üzeri',
      warnings: ['Yüksek seste uzun süre dinlemeyin', 'Suya temas ettirmeyin']
    },
    featured: false
  }
];

// Sample admin user
const adminUser = {
  username: process.env.ADMIN_USERNAME || 'sudoraadmin',
  password: process.env.ADMIN_PASSWORD || '23417202001Ceyda.',
  name: 'Sudora Admin',
  role: 'super_admin'
};

// Sample messages
const messages = [
  {
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    message: 'Merhaba, LED\'li nemlendirici ürünleriniz hakkında bilgi almak istiyorum. Toptan fiyat listesi paylaşabilir misiniz?',
    priority: 'normal'
  },
  {
    name: 'Fatma Demir',
    email: 'fatma@example.com',
    message: 'Vintage radyo modellerinizin minimum sipariş miktarı nedir? Mağazam için stok yapmak istiyorum.',
    priority: 'high'
  },
  {
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    message: 'Seramik hazneli nemlendiricilerin garanti süresi ne kadar? Müşterilerime bilgi vermek istiyorum.',
    priority: 'normal'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Veritabanı seeding işlemi başlatılıyor...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı');
    
    // Clear existing data
    console.log('🗑️  Mevcut veriler temizleniyor...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Admin.deleteMany({});
    await Message.deleteMany({});
    console.log('✅ Mevcut veriler temizlendi');
    
    // Seed categories (one by one to trigger pre-save middleware)
    console.log('📂 Kategoriler oluşturuluyor...');
    const createdCategories = [];
    for (const categoryData of categories) {
      const category = await Category.create(categoryData);
      createdCategories.push(category);
    }
    console.log(`✅ ${createdCategories.length} kategori oluşturuldu`);
    
    // Seed products
    console.log('📦 Ürünler oluşturuluyor...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} ürün oluşturuldu`);
    
    // Seed admin user
    console.log('👤 Admin kullanıcısı oluşturuluyor...');
    const admin = await Admin.create(adminUser);
    console.log(`✅ Admin kullanıcısı oluşturuldu: ${admin.username}`);
    
    // Seed messages
    console.log('💬 Örnek mesajlar oluşturuluyor...');
    const createdMessages = await Message.insertMany(messages);
    console.log(`✅ ${createdMessages.length} mesaj oluşturuldu`);
    
    console.log('\n🎉 Seeding işlemi başarıyla tamamlandı!');
    console.log('\n📊 Oluşturulan veriler:');
    console.log(`   - Kategoriler: ${createdCategories.length}`);
    console.log(`   - Ürünler: ${createdProducts.length}`);
    console.log(`   - Admin kullanıcısı: 1`);
    console.log(`   - Mesajlar: ${createdMessages.length}`);
    console.log('\n🔐 Admin giriş bilgileri:');
    console.log(`   - Kullanıcı Adı: ${admin.username}`);
    console.log(`   - Şifre: ${adminUser.password}`);
    console.log('\n🚀 Backend sunucusu başlatılabilir!');
    
  } catch (error) {
    console.error('❌ Seeding hatası:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB bağlantısı kapatıldı');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
