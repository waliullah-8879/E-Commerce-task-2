import bcrypt from 'bcryptjs';
import Product from './models/Product.js';
import User from './models/User.js';
export const products = [
  { name: 'Field Notes Tote', description: 'A durable canvas carryall for daily systems and weekend escapes.', price: 48, imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80', category: 'carry', stock: 18 },
  { name: 'Alpine Bottle', description: 'Insulated stainless steel, built for long walks and longer days.', price: 32, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80', category: 'outdoor', stock: 24 },
  { name: 'Studio Lamp', description: 'Warm, directional light with a quiet architectural silhouette.', price: 119, imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80', category: 'home', stock: 9 },
  { name: 'Everyday Chrono', description: 'A precise, minimal timepiece with a brushed steel case.', price: 185, imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80', category: 'wear', stock: 12 },
  { name: 'Workshop Apron', description: 'Heavyweight cotton, generous pockets, made to get marked up.', price: 74, imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80', category: 'carry', stock: 15 },
  { name: 'Cedar Tray', description: 'A hand-finished landing place for keys, tools, and small rituals.', price: 58, imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80', category: 'home', stock: 7 },
  { name: 'Merino Beanie', description: 'Soft, breathable merino wool. Essential for crisp mornings.', price: 38, imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=900&q=80', category: 'wear', stock: 3 },
  { name: 'Camp Mug', description: 'Enamel coated steel mug, perfect for coffee by the fire.', price: 18, imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80', category: 'outdoor', stock: 0 },
  { name: 'Leather Journal', description: 'Full-grain leather cover with premium dot-grid paper. Made to age beautifully.', price: 42, imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80', category: 'carry', stock: 35 },
  { name: 'Pour-Over Kettle', description: 'Matte black gooseneck kettle for precision brewing.', price: 65, imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=900&q=80', category: 'home', stock: 11 },
  { name: 'Trail Backpack', description: 'Weatherproof exterior and modular compartments for any terrain.', price: 145, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', category: 'outdoor', stock: 8 },
  { name: 'Ceramic Planter', description: 'Hand-thrown stoneware planter with a draining dish. Perfect for succulents.', price: 45, imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80', category: 'home', stock: 20 },
  { name: 'Essential Sunglasses', description: 'Polarized lenses with a timeless matte acetate frame.', price: 95, imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80', category: 'wear', stock: 14 },
  { name: 'Canvas Tool Roll', description: 'Keep your wrenches, pens, or brushes perfectly organized.', price: 34, imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80', category: 'carry', stock: 22 }
];

export async function runAutoSeed() {
  const count = await Product.countDocuments();
  if (count > 0) return; // Already seeded
  
  console.log('[DB] Seeding database...');
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
  console.log('[DB] Seeding complete.');
}
