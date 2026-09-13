import 'dotenv/config';
import { connectDb, disconnectDb } from './config/db.js';
import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

// Minimal programmatic test for core flows
async function runTests() {
  await connectDb();
  console.log('[TEST] Starting backend integration tests...');

  // 1. RBAC and Auth tests would typically use supertest with Express,
  // but here we verify the database constraints and stock atomicity logic.
  
  const testProduct = await Product.findOne({ stock: { $gt: 0 } });
  if (!testProduct) {
      console.log('[TEST] No in-stock product found to test.');
      process.exit(1);
  }

  const initialStock = testProduct.stock;
  console.log(`[TEST] Testing atomic stock decrement on: ${testProduct.name} (Stock: ${initialStock})`);

  const qtyToReserve = 2;
  
  // Simulate the atomic reservation (fallback mode)
  const reserved = await Product.findOneAndUpdate(
    { _id: testProduct._id, stock: { $gte: qtyToReserve } },
    { $inc: { stock: -qtyToReserve } },
    { new: true }
  );

  if (!reserved || reserved.stock !== initialStock - qtyToReserve) {
      console.error('[TEST] Failed: Stock was not reserved correctly.');
      process.exit(1);
  }
  
  console.log(`[TEST] Passed: Stock reserved successfully. New stock: ${reserved.stock}`);
  
  // Restore stock
  await Product.updateOne({ _id: testProduct._id }, { $inc: { stock: qtyToReserve } });

  // Test overselling protection
  const overReserve = initialStock + 10;
  const shouldFail = await Product.findOneAndUpdate(
    { _id: testProduct._id, stock: { $gte: overReserve } },
    { $inc: { stock: -overReserve } },
    { new: true }
  );

  if (shouldFail) {
      console.error('[TEST] Failed: Allowed overselling!');
      process.exit(1);
  }
  console.log('[TEST] Passed: Prevented overselling.');

  console.log('[TEST] All backend programmatic tests passed.');
  await disconnectDb();
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
