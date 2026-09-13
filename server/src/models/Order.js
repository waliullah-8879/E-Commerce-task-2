import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user: {
    name: { type: String, required: true }, email: { type: String, required: true },
    shippingAddress: { type: String, required: true, minlength: 8 },
    phone: { type: String, required: true }
  },
  items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, name: { type: String, required: true }, price: { type: Number, required: true, min: 0.01 }, qty: { type: Number, required: true, min: 1, validate: Number.isInteger } }],
  subtotal: { type: Number, required: true, min: 0 }, tax: { type: Number, required: true, min: 0 }, total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'paid', 'processing', 'shipped', 'cancelled'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

orderSchema.index({ userId: 1, timestamp: -1 });
orderSchema.index({ timestamp: -1 });

export default mongoose.model('Order', orderSchema);
