import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  price: { type: Number, required: true, min: 0.01 },
  imageUrl: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true, lowercase: true, index: true },
  stock: { type: Number, required: true, min: 0, validate: Number.isInteger }
}, { timestamps: true });

productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
