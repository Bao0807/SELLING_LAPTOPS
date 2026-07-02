'use strict';
const { Category, Product } = require('../models');

const validateCategoryPayload = (body, isUpdate = false) => {
  if (!isUpdate && !String(body.name || '').trim()) return 'Category name is required';
  if (!isUpdate && !String(body.slug || '').trim()) return 'Category slug is required';
  if (body.name !== undefined && !String(body.name).trim()) return 'Category name cannot be empty';
  if (body.slug !== undefined && !String(body.slug).trim()) return 'Category slug cannot be empty';
  return null;
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json({ success: true, message: 'Categories retrieved', data: categories });
  } catch (error) { next(error); }
};

exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug },
      include: [{ model: Product, attributes: ['id', 'name', 'slug', 'thumbnail', 'price', 'discount_price', 'stock_quantity'] }]
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category retrieved', data: category });
  } catch (error) { next(error); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const error = validateCategoryPayload(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    const category = await Category.create({
      ...req.body,
      name: String(req.body.name).trim(),
      slug: String(req.body.slug).trim()
    });
    res.status(201).json({ success: true, message: 'Category created', data: category });
  } catch (error) { next(error); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const error = validateCategoryPayload(req.body, true);
    if (error) return res.status(400).json({ success: false, message: error });

    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    await category.update(req.body);
    res.json({ success: true, message: 'Category updated', data: category });
  } catch (error) { next(error); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const productCount = await Product.count({ where: { category_id: category.id } });
    if (productCount > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete category with products' });
    }

    await category.destroy();
    res.json({ success: true, message: 'Category deleted', data: null });
  } catch (error) { next(error); }
};
