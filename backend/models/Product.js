const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı gereklidir'],
    trim: true,
    maxlength: [100, 'Ürün adı 100 karakterden fazla olamaz']
  },
  description: {
    type: String,
    required: [true, 'Ürün açıklaması gereklidir'],
    trim: true
    // Karakter sınırı tamamen kaldırıldı - 2025-08-03
    // maxlength sınırı artık yok
  },
  category: {
    type: String,
    required: [true, 'Kategori gereklidir'],
    trim: true
  },
  // Ana ürün resmi (ilk varyasyonun ilk resmi otomatik olarak atanacak)
  imageUrl: {
    type: String,
    default: '/placeholder.svg'
  },
  material: {
    type: String,
    trim: true,
    maxlength: [200, 'Malzeme bilgisi 200 karakterden fazla olamaz']
  },
  dimensions: {
    type: String,
    trim: true,
    maxlength: [100, 'Boyut bilgisi 100 karakterden fazla olamaz']
  },
  // Renk Varyasyonları
  variants: [{
    color: {
      type: String,
      required: true,
      trim: true
    },
    colorCode: {
      type: String,
      trim: true // Hex renk kodu (örn: "#FF0000")
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr) {
          return arr.length <= 8; // Her renk için maksimum 8 medya dosyası
        },
        message: 'Her renk için en fazla 8 medya dosyası yüklenebilir'
      }
    },
    stock: {
      quantity: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  }],
  // Teknik Özellikler
  specifications: {
    // Genel özellikler
    warranty: String,         // Garanti Süresi (örn: "2 Yıl")
    origin: String,           // Menşei (örn: "CN")
    features: [String],       // Özellikler listesi
    guaranteeType: String,    // Garanti Tipi
    importerGuarantee: String, // İthalatçı Garantisi

    // Radyo spesifik özellikler
    model: String,            // Model (örn: "FP-337-S")
    radioFrequency: String,   // Radyo Frekansı (örn: "FM 88-108 MHz")
    musicInputs: String,      // Müzik Girişleri (örn: "USB / TF Kart / Bluetooth")
    mp3Support: String,       // MP3 Desteği (örn: "Var")
    battery: String,          // Batarya (örn: "18650 Lithium pil")
    chargingTime: String,     // Şarj Süresi (örn: "5-6 saat")
    solarPanel: String,       // Solar Panel (örn: "5V solar panel")
    lightEffect: String,      // Işık Efekti (örn: "Alev efektli LED")
    antenna: String,          // Anten (örn: "360° dönebilen")
    receiver: String,         // Alıcı (örn: "Yüksek hassasiyetli")
    speaker: String,          // Hoparlör (örn: "Güçlü ses çıkışı")
    connections: String,      // Bağlantılar (örn: "AUX in jack, DC 5V")
    bluetooth: String,        // Bluetooth (örn: "Bluetooth 5.4")

    // Nemlendirici spesifik özellikler
    powerInput: String,       // Güç Girişi (örn: "DC 24V / 650 mA")
    tankCapacity: String,     // Su Haznesi Kapasitesi (örn: "250 ml")
    vaporOutput: String,      // Buhar Çıkışı (örn: "10-30 ml/saat")
    weight: String,           // Ağırlık (örn: "420 gr")
    material: String,         // Malzeme (örn: "ABS + PP")
    functions: String,        // Fonksiyonlar (örn: "Jellyfish Decompression, Simüle Alev")
    timer: String,            // Zamanlayıcı (örn: "1-3 saat ayarlanabilir")
    essentialOilCompatible: String, // Uçucu Yağ Uyumu
    remoteControl: String,    // Uzaktan Kumanda
    powerProtection: String,  // Elektrik Kesintisi Koruması

    // Kamp Lambası spesifik özellikler
    interface: String,        // Arayüz (örn: "Type-C")
    inputVoltage: String,     // Giriş Voltajı (örn: "5V / 1A")
    ledPower: String,         // LED Işık Gücü (örn: "2.4W")
    speakerPower: String,     // Hoparlör Gücü (örn: "5W")
    frequencyResponse: String, // Frekans Yanıtı (örn: "70Hz - 18kHz")
    bluetoothRange: String,   // Bluetooth Menzili (örn: "10 metre")
    bluetoothVersion: String, // Bluetooth Versiyonu (örn: "5.4")
    batteryCapacity: String,  // Batarya Kapasitesi (örn: "1800 mAh")
    colorfulLight: String,    // Renkli Işık (örn: "RGB renk geçişli")
    nightLight: String,       // Gece Lambası
    touchSwitch: String,      // Dokunmatik Anahtar
    soundEffects: String,     // Ses Efektleri
    endurance: String         // Dayanıklılık
  },
  // Güvenlik Bilgileri
  safetyInfo: {
    ageRestriction: String,   // Yaş kısıtlaması
    warnings: [String]        // Uyarılar listesi
  },
  // Stok Yönetimi
  stock: {
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    minStock: {
      type: Number,
      default: 5,
      min: 0
    },
    maxStock: {
      type: Number,
      default: 1000,
      min: 0
    },
    unit: {
      type: String,
      default: 'adet',
      enum: ['adet', 'kg', 'lt', 'mt', 'paket']
    },
    location: String,         // Depo konumu
    supplier: String,         // Tedarikçi
    costPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    salePrice: {
      type: Number,
      default: 0,
      min: 0
    },
    lastRestocked: Date,      // Son stok tarihi
    notes: String             // Stok notları
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: false // Make it optional for existing products
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ active: 1 });

// Virtual for formatted creation date
productSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('tr-TR');
});

// Pre-save middleware to update updatedAt
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
