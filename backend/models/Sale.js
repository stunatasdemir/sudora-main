const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

const saleSchema = new mongoose.Schema({
  saleNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'Türkiye'
      }
    },
    taxNumber: String,
    companyName: String
  },
  items: [saleItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 18,
    min: 0,
    max: 100
  },
  taxAmount: {
    type: Number,
    required: true,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['nakit', 'kredi_karti', 'banka_havalesi', 'cek', 'senet'],
    default: 'nakit'
  },
  paymentStatus: {
    type: String,
    enum: ['beklemede', 'odendi', 'kismen_odendi', 'iptal'],
    default: 'beklemede'
  },
  saleStatus: {
    type: String,
    enum: ['taslak', 'onaylandi', 'hazirlaniyor', 'kargoda', 'teslim_edildi', 'iptal'],
    default: 'taslak'
  },
  notes: String,
  saleDate: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  deliveryDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
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

// Auto-generate sale number
saleSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Sale').countDocuments();
    const year = new Date().getFullYear();
    this.saleNumber = `SAT-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Virtual for formatted sale date
saleSchema.virtual('formattedSaleDate').get(function() {
  return this.saleDate.toLocaleDateString('tr-TR');
});

// Virtual for profit calculation
saleSchema.virtual('profit').get(function() {
  // Bu hesaplama için ürünlerin maliyet fiyatlarına ihtiyaç var
  // Şimdilik basit bir hesaplama yapıyoruz
  return this.totalAmount * 0.3; // %30 kar marjı varsayımı
});

// Index for better performance
saleSchema.index({ saleNumber: 1 });
saleSchema.index({ 'customer.name': 1 });
saleSchema.index({ saleDate: -1 });
saleSchema.index({ saleStatus: 1 });
saleSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Sale', saleSchema);
