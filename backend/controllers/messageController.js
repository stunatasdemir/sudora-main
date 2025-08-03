const { Message } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Create new message (Contact form)
// @route   POST /api/messages
// @access  Public
const createMessage = asyncHandler(async (req, res) => {
  const messageData = {
    ...req.body,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent')
  };
  
  const message = await Message.create(messageData);
  
  res.status(201).json({
    success: true,
    message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
    data: {
      id: message._id,
      createdAt: message.createdAt
    }
  });
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Admin)
const getMessages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  // Build filter object
  const filter = {};
  
  // Read status filter
  if (req.query.read !== undefined) {
    filter.read = req.query.read === 'true';
  }
  
  // Reply status filter
  if (req.query.replied !== undefined) {
    filter.replied = req.query.replied === 'true';
  }
  
  // Priority filter
  if (req.query.priority) {
    filter.priority = req.query.priority;
  }
  
  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate) {
      filter.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      filter.createdAt.$lte = new Date(req.query.endDate);
    }
  }
  
  // Search filter
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }
  
  // Sort options
  let sortOptions = { createdAt: -1 }; // Default: newest first
  
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'priority':
        sortOptions = { priority: -1, createdAt: -1 };
        break;
      case 'unread':
        sortOptions = { read: 1, createdAt: -1 };
        break;
    }
  }
  
  const messages = await Message.find(filter)
    .sort(sortOptions)
    .limit(limit)
    .skip(skip)
    .populate('readBy', 'name email')
    .populate('repliedBy', 'name email')
    .select('-__v');
  
  const total = await Message.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  
  // Get statistics
  const stats = await Message.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } },
        unreplied: { $sum: { $cond: [{ $eq: ['$replied', false] }, 1, 0] } },
        urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } }
      }
    }
  ]);
  
  res.json({
    success: true,
    data: messages,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    stats: stats[0] || { total: 0, unread: 0, unreplied: 0, urgent: 0 }
  });
});

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private (Admin)
const getMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id)
    .populate('readBy', 'name email')
    .populate('repliedBy', 'name email')
    .select('-__v');
  
  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Mesaj bulunamadı'
    });
  }
  
  res.json({
    success: true,
    data: message
  });
});

// @desc    Mark message as read
// @route   PATCH /api/messages/:id/read
// @access  Private (Admin)
const markAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  
  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Mesaj bulunamadı'
    });
  }
  
  if (!message.read) {
    message.read = true;
    message.readAt = new Date();
    message.readBy = req.admin._id;
    await message.save();
  }
  
  res.json({
    success: true,
    message: 'Mesaj okundu olarak işaretlendi',
    data: message
  });
});

// @desc    Mark message as unread
// @route   PATCH /api/messages/:id/unread
// @access  Private (Admin)
const markAsUnread = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  
  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Mesaj bulunamadı'
    });
  }
  
  message.read = false;
  message.readAt = undefined;
  message.readBy = undefined;
  await message.save();
  
  res.json({
    success: true,
    message: 'Mesaj okunmadı olarak işaretlendi',
    data: message
  });
});

// @desc    Reply to message
// @route   POST /api/messages/:id/reply
// @access  Private (Admin)
const replyToMessage = asyncHandler(async (req, res) => {
  const { replyMessage } = req.body;
  
  if (!replyMessage || replyMessage.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Yanıt mesajı gereklidir'
    });
  }
  
  const message = await Message.findById(req.params.id);
  
  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Mesaj bulunamadı'
    });
  }
  
  message.replied = true;
  message.replyMessage = replyMessage.trim();
  message.repliedAt = new Date();
  message.repliedBy = req.admin._id;
  
  // Also mark as read if not already
  if (!message.read) {
    message.read = true;
    message.readAt = new Date();
    message.readBy = req.admin._id;
  }
  
  await message.save();
  
  // Here you could add email sending logic
  // await sendReplyEmail(message.email, message.name, replyMessage);
  
  res.json({
    success: true,
    message: 'Yanıt başarıyla gönderildi',
    data: message
  });
});

// @desc    Update message priority
// @route   PATCH /api/messages/:id/priority
// @access  Private (Admin)
const updatePriority = asyncHandler(async (req, res) => {
  const { priority } = req.body;
  
  if (!['low', 'normal', 'high', 'urgent'].includes(priority)) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz öncelik değeri'
    });
  }
  
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { priority },
    { new: true, runValidators: true }
  );
  
  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Mesaj bulunamadı'
    });
  }
  
  res.json({
    success: true,
    message: 'Mesaj önceliği güncellendi',
    data: message
  });
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  
  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Mesaj bulunamadı'
    });
  }
  
  await Message.findByIdAndDelete(req.params.id);
  
  res.json({
    success: true,
    message: 'Mesaj başarıyla silindi'
  });
});

// @desc    Bulk operations on messages
// @route   POST /api/messages/bulk
// @access  Private (Admin)
const bulkOperations = asyncHandler(async (req, res) => {
  const { action, messageIds } = req.body;
  
  if (!Array.isArray(messageIds) || messageIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Mesaj ID\'leri gereklidir'
    });
  }
  
  let updateData = {};
  let successMessage = '';
  
  switch (action) {
    case 'markRead':
      updateData = { 
        read: true, 
        readAt: new Date(), 
        readBy: req.admin._id 
      };
      successMessage = 'Mesajlar okundu olarak işaretlendi';
      break;
    case 'markUnread':
      updateData = { 
        read: false, 
        $unset: { readAt: 1, readBy: 1 } 
      };
      successMessage = 'Mesajlar okunmadı olarak işaretlendi';
      break;
    case 'delete':
      await Message.deleteMany({ _id: { $in: messageIds } });
      return res.json({
        success: true,
        message: 'Mesajlar başarıyla silindi'
      });
    default:
      return res.status(400).json({
        success: false,
        message: 'Geçersiz işlem'
      });
  }
  
  await Message.updateMany(
    { _id: { $in: messageIds } },
    updateData
  );
  
  res.json({
    success: true,
    message: successMessage
  });
});

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  markAsRead,
  markAsUnread,
  replyToMessage,
  updatePriority,
  deleteMessage,
  bulkOperations
};
