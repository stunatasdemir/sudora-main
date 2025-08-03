const { Product } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Build filter object
  const filter = { active: true };
  
  // Category filter
  if (req.query.category && req.query.category !== 'all') {
    filter.category = req.query.category;
  }
  
  // Featured filter
  if (req.query.featured === 'true') {
    filter.featured = true;
  }
  
  // Search filter
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }
  
  // Sort options
  let sortOptions = { sortOrder: 1, createdAt: -1 }; // Default: sort order first, then newest
  
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'name_asc':
        sortOptions = { name: 1 };
        break;
      case 'name_desc':
        sortOptions = { name: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'featured':
        sortOptions = { featured: -1, createdAt: -1 };
        break;
    }
  }
  
  try {
    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(limit)
      .skip(skip)
      .select('-__v');
    
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    throw error;
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ 
    _id: req.params.id, 
    active: true 
  }).select('-__v');
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Ürün bulunamadı'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = asyncHandler(async (req, res) => {
  console.log('=== ÜRÜN OLUŞTURMA DEBUG ===');
  console.log('Gelen veri:', JSON.stringify(req.body, null, 2));
  console.log('Açıklama uzunluğu:', req.body.description ? req.body.description.length : 'Açıklama yok');

  const productData = {
    ...req.body
  };

  // Add createdBy if admin info is available
  if (req.admin && req.admin._id) {
    productData.createdBy = req.admin._id;
  }

  // Set sortOrder to the highest value + 1 if not provided
  if (productData.sortOrder === undefined) {
    const lastProduct = await Product.findOne().sort({ sortOrder: -1 });
    productData.sortOrder = lastProduct ? (lastProduct.sortOrder || 0) + 1 : 0;
  }

  console.log('İşlenmiş veri:', JSON.stringify(productData, null, 2));
  console.log('Product schema validation kuralları kontrol ediliyor...');

  try {
    const product = await Product.create(productData);
    console.log('Ürün başarıyla oluşturuldu:', product._id);

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla oluşturuldu',
      data: product
    });
  } catch (error) {
    console.log('=== ÜRÜN OLUŞTURMA HATASI ===');
    console.log('Hata türü:', error.name);
    console.log('Hata mesajı:', error.message);
    console.log('Validation errors:', error.errors);
    console.log('Tam hata:', error);
    throw error;
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Ürün bulunamadı'
    });
  }
  
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: Date.now() },
    { new: true, runValidators: true }
  ).select('-__v');
  
  res.json({
    success: true,
    message: 'Ürün başarıyla güncellendi',
    data: updatedProduct
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Ürün bulunamadı'
    });
  }

  // Hard delete - completely remove from database
  await Product.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Ürün başarıyla silindi'
  });
});

// @desc    Toggle product featured status
// @route   PATCH /api/products/:id/featured
// @access  Private (Admin)
const toggleFeatured = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Ürün bulunamadı'
    });
  }
  
  product.featured = !product.featured;
  await product.save();
  
  res.json({
    success: true,
    message: `Ürün ${product.featured ? 'öne çıkarıldı' : 'öne çıkarılmaktan çıkarıldı'}`,
    data: product
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;

  const products = await Product.find({
    featured: true,
    active: true
  })
    .sort({ sortOrder: 1, createdAt: -1 })
    .limit(limit)
    .select('-__v');

  res.json({
    success: true,
    data: products
  });
});

// @desc    Update products sort order
// @route   PATCH /api/products/reorder
// @access  Private (Admin)
const reorderProducts = asyncHandler(async (req, res) => {
  const { productOrders } = req.body;

  if (!Array.isArray(productOrders)) {
    return res.status(400).json({
      success: false,
      message: 'productOrders array gereklidir'
    });
  }

  try {
    // Update each product's sort order
    const updatePromises = productOrders.map(({ id, sortOrder }) =>
      Product.findByIdAndUpdate(id, { sortOrder }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Ürün sıralaması başarıyla güncellendi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sıralama güncellenirken hata oluştu'
    });
  }
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  getFeaturedProducts,
  reorderProducts
};
