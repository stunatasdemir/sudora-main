const { Category, Product } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const includeInactive = req.query.includeInactive === 'true' && req.admin;
  
  const filter = includeInactive ? {} : { active: true };
  
  const categories = await Category.find(filter)
    .sort({ sortOrder: 1, name: 1 })
    .populate('productCount')
    .select('-__v');
  
  res.json({
    success: true,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    active: true
  })
    .populate('productCount')
    .select('-__v');
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Kategori bulunamadı'
    });
  }
  
  res.json({
    success: true,
    data: category
  });
});

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    slug: req.params.slug,
    active: true
  })
    .populate('productCount')
    .select('-__v');
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Kategori bulunamadı'
    });
  }
  
  res.json({
    success: true,
    data: category
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = asyncHandler(async (req, res) => {
  // Check if category with same name already exists
  const existingCategory = await Category.findOne({ 
    name: req.body.name 
  });
  
  if (existingCategory) {
    return res.status(400).json({
      success: false,
      message: 'Bu isimde bir kategori zaten mevcut'
    });
  }
  
  const category = await Category.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Kategori başarıyla oluşturuldu',
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Kategori bulunamadı'
    });
  }
  
  // Check if new name conflicts with existing category
  if (req.body.name && req.body.name !== category.name) {
    const existingCategory = await Category.findOne({ 
      name: req.body.name,
      _id: { $ne: req.params.id }
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Bu isimde bir kategori zaten mevcut'
      });
    }
  }
  
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-__v');
  
  res.json({
    success: true,
    message: 'Kategori başarıyla güncellendi',
    data: updatedCategory
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Kategori bulunamadı'
    });
  }
  
  // Check if category has products
  const productCount = await Product.countDocuments({
    category: category.name
  });

  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Bu kategoride ${productCount} ürün bulunuyor. Önce ürünleri başka kategoriye taşıyın veya silin.`
    });
  }

  // Hard delete - completely remove from database
  await Category.findByIdAndDelete(req.params.id);
  
  res.json({
    success: true,
    message: 'Kategori başarıyla silindi'
  });
});

// @desc    Toggle category active status
// @route   PATCH /api/categories/:id/toggle
// @access  Private (Admin)
const toggleActive = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Kategori bulunamadı'
    });
  }
  
  category.active = !category.active;
  await category.save();
  
  res.json({
    success: true,
    message: `Kategori ${category.active ? 'aktif' : 'pasif'} hale getirildi`,
    data: category
  });
});

// @desc    Update category sort order
// @route   PATCH /api/categories/reorder
// @access  Private (Admin)
const reorderCategories = asyncHandler(async (req, res) => {
  const { categories } = req.body;
  
  if (!Array.isArray(categories)) {
    return res.status(400).json({
      success: false,
      message: 'Kategoriler dizi formatında olmalıdır'
    });
  }
  
  // Update sort order for each category
  const updatePromises = categories.map((cat, index) => 
    Category.findByIdAndUpdate(cat.id, { sortOrder: index })
  );
  
  await Promise.all(updatePromises);
  
  res.json({
    success: true,
    message: 'Kategori sıralaması güncellendi'
  });
});

module.exports = {
  getCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleActive,
  reorderCategories
};
