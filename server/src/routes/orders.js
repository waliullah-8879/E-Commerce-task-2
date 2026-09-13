import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/async.js';

const router = Router();
router.use(authenticate);

// GET /api/orders
router.get('/', asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };
  const orders = await Order.find(filter).sort({ timestamp: -1 });
  res.json(orders);
}));

// GET /api/orders/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.id };
  const order = await Order.findOne(filter);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));

// POST /api/orders (Checkout)
router.post('/', asyncHandler(async (req, res) => {
  const { shippingAddress, items, phone } = req.body;
  if (!shippingAddress || shippingAddress.length < 8) {
    return res.status(400).json({ message: 'Valid shipping address is required' });
  }
  if (!phone || phone.length < 10) {
    return res.status(400).json({ message: 'Valid phone number is required' });
  }
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: 'Cart items are required' });
  }

  // Validate item format
  const validItems = items.every(item => item.productId && mongoose.Types.ObjectId.isValid(item.productId) && Number.isInteger(item.qty) && item.qty >= 1);
  if (!validItems) {
    return res.status(400).json({ message: 'Invalid items payload' });
  }

  const ids = items.map(item => item.productId);
  const dbProducts = await Product.find({ _id: { $in: ids } });
  
  if (dbProducts.length !== items.length) {
    return res.status(400).json({ message: 'One or more products no longer exist' });
  }

  let order;
  const session = await mongoose.startSession();

  try {
    // Attempt dual-mode stock decrement
    const hasTransactions = mongoose.connection.client.topology.s.description.type !== 'Single'; // Simplified check, could also try/catch withTransaction

      if (hasTransactions) {
        await session.withTransaction(async () => {
          const lineItems = await reserveStock(items, dbProducts, session);
          order = await createOrder(req.user, shippingAddress, phone, lineItems, session);
        });
      } else {
      // Fallback: Atomic findOneAndUpdate with rollback
      const reservedItems = [];
      try {
        for (const item of items) {
          const product = dbProducts.find(p => p._id.toString() === item.productId);
          const reserved = await Product.findOneAndUpdate(
            { _id: product._id, stock: { $gte: item.qty } },
            { $inc: { stock: -item.qty } },
            { new: true } // No session here as it's outside transaction
          );
          if (!reserved) {
            throw new Error(`Out of stock: ${product.name}`);
          }
          reservedItems.push(item);
        }
        
        const lineItems = items.map(item => {
           const product = dbProducts.find(p => p._id.toString() === item.productId);
           return { productId: product._id, name: product.name, price: product.price, qty: item.qty };
        });
        
        order = await createOrder(req.user, shippingAddress, phone, lineItems, null);

      } catch (err) {
        // Rollback reserved items if a subsequent item failed
        for (const item of reservedItems) {
          await Product.updateOne({ _id: item.productId }, { $inc: { stock: item.qty } });
        }
        const error = new Error(err.message);
        error.status = 409;
        throw error;
      }
    }

    res.status(201).json(order);
  } finally {
    await session.endSession();
  }
}));

// PATCH /api/orders/:id/status
router.patch('/:id/status', authorize('admin'), asyncHandler(async (req, res) => {
  const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'cancelled'];
  if (!validStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  const order = await Order.findByIdAndUpdate(
    req.params.id, 
    { status: req.body.status }, 
    { new: true, runValidators: true }
  );
  
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));


// Helper Functions for checkout
async function reserveStock(items, dbProducts, session) {
    const lineItems = [];
    for (const item of items) {
        const product = dbProducts.find(p => p._id.toString() === item.productId);
        const qty = item.qty;
        
        const reserved = await Product.findOneAndUpdate(
            { _id: product._id, stock: { $gte: qty } },
            { $inc: { stock: -qty } },
            { new: true, session }
        );
        
        if (!reserved) {
            const error = new Error(`Out of stock: ${product.name}`);
            error.status = 409; // Conflict
            throw error;
        }
        lineItems.push({ productId: product._id, name: product.name, price: product.price, qty });
    }
    return lineItems;
}

async function createOrder(user, shippingAddress, phone, lineItems, session) {
    const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = Number((subtotal * 0.08).toFixed(2));
    
    const [order] = await Order.create([{
        userId: user.id,
        user: { name: user.name, email: user.email, shippingAddress, phone },
        items: lineItems,
        subtotal,
        tax,
        total: subtotal + tax,
        status: 'paid'
    }], { session });
    
    return order;
}

export default router;
