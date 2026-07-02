'use strict';

const { Product, Category, ProductImage, Review, User, OrderItem } = require('../models');
const { Op, fn, col, literal, where: sqlWhere } = require('sequelize');

const EFFECTIVE_PRICE = literal('COALESCE(`Product`.`discount_price`, `Product`.`price`)');

const toPositiveInt = (value, fallback) => {
  const number = Number(value ?? fallback);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

const attachReviewStats = async (products) => {
  const rows = Array.isArray(products) ? products : [products];
  const ids = rows.filter(Boolean).map((product) => product.id);
  if (ids.length === 0) return products;

  const stats = await Review.findAll({
    attributes: [
      'product_id',
      [fn('AVG', col('rating')), 'average_rating'],
      [fn('COUNT', col('id')), 'review_count']
    ],
    where: { product_id: ids },
    group: ['product_id']
  });

  const statsByProduct = new Map(stats.map((row) => [
    row.product_id,
    {
      average_rating: Number(Number(row.get('average_rating') || 0).toFixed(1)),
      review_count: Number(row.get('review_count') || 0)
    }
  ]));

  rows.forEach((product) => {
    const stat = statsByProduct.get(product.id) || { average_rating: 0, review_count: 0 };
    product.setDataValue('average_rating', stat.average_rating);
    product.setDataValue('review_count', stat.review_count);
  });

  return products;
};

const validateProductPayload = (body, isUpdate = false) => {
  const errors = [];
  if (!isUpdate && !String(body.name || '').trim()) errors.push('Product name is required');
  if (!isUpdate && !String(body.slug || '').trim()) errors.push('Product slug is required');
  if (!isUpdate && body.price === undefined) errors.push('Price is required');

  const price = body.price === undefined || body.price === '' ? null : Number(body.price);
  const discountPrice = body.discount_price === undefined || body.discount_price === '' ? null : Number(body.discount_price);
  const stock = body.stock_quantity === undefined || body.stock_quantity === '' ? null : Number(body.stock_quantity);

  if (price !== null && (!Number.isFinite(price) || price <= 0)) errors.push('Price must be greater than 0');
  if (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice <= 0)) errors.push('Discount price must be greater than 0');
  if (price !== null && discountPrice !== null && discountPrice >= price) errors.push('Discount price must be lower than price');
  if (stock !== null && (!Number.isInteger(stock) || stock < 0)) errors.push('Stock quantity must be 0 or more');

  return errors;
};

exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      sort = 'newest',
      q,
      discount
    } = req.query;

    const safePage = toPositiveInt(page, 1);
    const safeLimit = Math.min(toPositiveInt(limit, 12), 100);
    const offset = (safePage - 1) * safeLimit;
    const productWhere = {};
    const andFilters = [];

    const keyword = String(q || '').trim();
    if (keyword) {
      productWhere[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { brand: { [Op.like]: `%${keyword}%` } },
        { cpu: { [Op.like]: `%${keyword}%` } },
        { ram: { [Op.like]: `%${keyword}%` } },
        { storage: { [Op.like]: `%${keyword}%` } },
        { gpu: { [Op.like]: `%${keyword}%` } }
      ];
    }

    if (brand) productWhere.brand = brand;

    if (minPrice !== undefined && minPrice !== '') {
      const min = Number(minPrice);
      if (Number.isFinite(min)) {
        andFilters.push(sqlWhere(fn('COALESCE', col('Product.discount_price'), col('Product.price')), { [Op.gte]: min }));
      }
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      const max = Number(maxPrice);
      if (Number.isFinite(max)) {
        andFilters.push(sqlWhere(fn('COALESCE', col('Product.discount_price'), col('Product.price')), { [Op.lte]: max }));
      }
    }
    if (discount === 'true') {
      andFilters.push(literal('`Product`.`discount_price` IS NOT NULL AND `Product`.`discount_price` < `Product`.`price`'));
    }
    if (andFilters.length > 0) productWhere[Op.and] = andFilters;

    const categoryInclude = {
      model: Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    };
    if (category) {
      const isNumeric = /^\d+$/.test(String(category));
      categoryInclude.where = isNumeric ? { id: Number(category) } : { slug: category };
    }

    const orderMap = {
      newest: [['createdAt', 'DESC']],
      oldest: [['createdAt', 'ASC']],
      price_asc: [[EFFECTIVE_PRICE, 'ASC']],
      price_desc: [[EFFECTIVE_PRICE, 'DESC']],
      name_asc: [['name', 'ASC']]
    };

    const { count, rows } = await Product.findAndCountAll({
      where: productWhere,
      include: [
        categoryInclude,
        { model: ProductImage, as: 'images', attributes: ['image_url'], limit: 1 }
      ],
      order: orderMap[sort] || orderMap.newest,
      limit: safeLimit,
      offset,
      distinct: true
    });

    await attachReviewStats(rows);

    res.json({
      success: true,
      message: 'Products retrieved',
      data: {
        products: rows,
        pagination: {
          total: count,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(count / safeLimit)
        }
      }
    });
  } catch (error) { next(error); }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'image_url'] },
        {
          model: Review,
          as: 'reviews',
          attributes: ['id', 'rating', 'comment', 'createdAt'],
          include: [{ model: User, as: 'user', attributes: ['full_name', 'avatar'] }]
        }
      ]
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await attachReviewStats(product);
    res.json({ success: true, message: 'Product retrieved', data: product });
  } catch (error) { next(error); }
};

exports.searchProducts = async (req, res, next) => {
  const { q, limit = 10 } = req.query;
  const keyword = String(q || '').trim();
  if (!keyword) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }

  try {
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { brand: { [Op.like]: `%${keyword}%` } },
          { cpu: { [Op.like]: `%${keyword}%` } },
          { ram: { [Op.like]: `%${keyword}%` } },
          { storage: { [Op.like]: `%${keyword}%` } },
          { gpu: { [Op.like]: `%${keyword}%` } }
        ]
      },
      include: [{ model: Category, as: 'category', attributes: ['name', 'slug'] }],
      limit: Math.min(toPositiveInt(limit, 10), 50)
    });
    await attachReviewStats(products);
    res.json({ success: true, message: 'Search results', data: products });
  } catch (error) { next(error); }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        is_featured: true,
        stock_quantity: { [Op.gt]: 0 }
      },
      include: [{ model: Category, as: 'category', attributes: ['name', 'slug'] }],
      limit: 8,
      order: [['createdAt', 'DESC']]
    });
    await attachReviewStats(products);
    res.json({ success: true, message: 'Featured products', data: products });
  } catch (error) { next(error); }
};

exports.getBestsellers = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      attributes: {
        include: [
          [fn('COALESCE', fn('SUM', col('orderItems.quantity')), 0), 'totalSold']
        ]
      },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          attributes: [],
          required: false
        },
        { model: Category, as: 'category', attributes: ['name', 'slug'] }
      ],
      group: ['Product.id', 'category.id'],
      order: [[literal('totalSold'), 'DESC']],
      limit: 8,
      subQuery: false
    });
    await attachReviewStats(products);
    res.json({ success: true, message: 'Bestsellers', data: products });
  } catch (error) { next(error); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const errors = validateProductPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    let thumbnail = '';
    if (req.file) {
      thumbnail = `/uploads/${req.file.filename}`;
    }

    const is_featured = req.body.is_featured === 'true' || req.body.is_featured === true;
    const product = await Product.create({ ...req.body, thumbnail, is_featured });
    res.status(201).json({ success: true, message: 'Product created', data: product });
  } catch (error) { next(error); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validateProductPayload(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    if (req.body.is_featured !== undefined) {
      req.body.is_featured = req.body.is_featured === 'true' || req.body.is_featured === true;
    }

    await product.update(req.body);
    res.json({ success: true, message: 'Product updated', data: product });
  } catch (error) { next(error); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.destroy();
    res.json({ success: true, message: 'Product deleted', data: null });
  } catch (error) { next(error); }
};

exports.addProductImages = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const images = req.files.map(file => ({
      product_id: product.id,
      image_url: `/uploads/${file.filename}`
    }));

    const created = await ProductImage.bulkCreate(images);
    res.status(201).json({ success: true, message: 'Images added', data: created });
  } catch (error) { next(error); }
};
