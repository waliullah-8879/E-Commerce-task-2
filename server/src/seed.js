import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDb, disconnectDb } from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';

import { products } from './seedData.js';

async function runSeed() {
  await connectDb();
  await Product.deleteMany();
  await Product.insertMany(products);
  
  await User.findOneAndUpdate(
    { email: 'admin@northstar.test' },
    { name: 'Northstar Admin', email: 'admin@northstar.test', passwordHash: await bcrypt.hash('admin1234', 12), role: 'admin' },
    { upsert: true, new: true }
  );

  await User.findOneAndUpdate(
    { email: 'customer@northstar.test' },
    { name: 'Demo Customer', email: 'customer@northstar.test', passwordHash: await bcrypt.hash('customer1234', 12), role: 'customer' },
    { upsert: true, new: true }
  );

  console.log('Seed complete');
  await disconnectDb();
  process.exit(0);
}

runSeed().catch(err => {
  console.error(err);
  process.exit(1);
});
