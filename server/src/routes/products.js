import { Router } from 'express';
import Product from '../models/Product.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/async.js';

const router = Router();

// GET /api/products — paginated, filtered, sorted
router.get('/', asyncHandler(async (req, res) => {
  const page  = Math.max(Number(req.query.page)  || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 100);

  const filter = {};
  if (req.query.category && req.query.category !== 'all') {
    filter.category = req.query.category.toLowerCase().trim();
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  // Text search across name and description
  if (req.query.search && req.query.search.trim()) {
    filter.$text = { $search: req.query.search.trim() };
  }

  const sortMap = {
    'price-asc':  { price: 1 },
    'price-desc': { price: -1 },
    newest:       { createdAt: -1 },
  };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}));

// GET /api/products/categories — list distinct categories
router.get('/categories', asyncHandler(async (_req, res) => {
  const cats = await Product.distinct('category');
  res.json({ categories: cats.sort() });
}));

// GET /api/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

// POST /api/products — admin only
router.post('/', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { name, description, price, imageUrl, category, stock } = req.body;
  if (!name || !description || !price || !imageUrl || !category || stock == null) {
    return res.status(400).json({ message: 'All product fields are required' });
  }
  const product = await Product.create({
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    imageUrl: imageUrl.trim(),
    category: category.toLowerCase().trim(),
    stock: Number(stock),
  });
  res.status(201).json(product);
}));

// PUT /api/products/:id — admin only
router.put('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

// DELETE /api/products/:id — admin only
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(204).end();
}));

export default router;
