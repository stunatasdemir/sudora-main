const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ad soyad gereklidir'],
    trim: true,
    maxlength: [100, 'Ad soyad 100 karakterden fazla olamaz']
  },
  email: {
    type: String,
    required: [true, 'E-posta adresi gereklidir'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Geçerli bir e-posta adresi giriniz'
    ]
  },
  message: {
    type: String,
    required: [true, 'Mesaj gereklidir'],
    trim: true,
    maxlength: [2000, 'Mesaj 2000 karakterden fazla olamaz']
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  readBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  replied: {
    type: Boolean,
    default: false
  },
  replyMessage: {
    type: String,
    trim: true
  },
  repliedAt: {
    type: Date
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  tags: [{
    type: String,
    trim: true
  }],
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better search and filtering
messageSchema.index({ email: 1 });
messageSchema.index({ read: 1 });
messageSchema.index({ replied: 1 });
messageSchema.index({ priority: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ name: 'text', email: 'text', message: 'text' });

// Virtual for formatted creation date
messageSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for time since creation
messageSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} gün önce`;
  if (hours > 0) return `${hours} saat önce`;
  if (minutes > 0) return `${minutes} dakika önce`;
  return 'Az önce';
});

// Pre-save middleware to set readAt when read status changes
messageSchema.pre('save', function(next) {
  if (this.isModified('read') && this.read && !this.readAt) {
    this.readAt = new Date();
  }
  if (this.isModified('replied') && this.replied && !this.repliedAt) {
    this.repliedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);
