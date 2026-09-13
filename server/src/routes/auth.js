import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/async.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'northstar-dev-super-secret-key-12345';
const tokenFor = (user) => jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({ message: 'Name, valid email, and an 8-character password are required' });
  }
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) return res.status(409).json({ message: 'Email is already registered' });
  
  // Public registration always forces role: 'customer' to prevent unauthorized privilege escalation
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: await bcrypt.hash(password, 12),
    role: 'customer'
  });
  res.status(201).json({ token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

export default router;

