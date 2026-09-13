import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (address.length < 8) {
      showToast('Please enter a full shipping address', 'error');
      return;
    }
    if (phone.length < 10) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('northstar_token');
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingAddress: address,
          phone: phone,
          items: cart.map(item => ({ productId: item._id, qty: item.qty }))
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 409) {
          throw new Error('Some items in your cart just went out of stock. Please review your cart.');
        }
        throw new Error(data.message || 'Checkout failed');
      }
      
      clearCart();
      setSuccess(true);
      showToast('Order placed successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
      if (err.message.includes('out of stock')) {
        setTimeout(() => navigate('/cart'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-wrap flex flex-col items-center justify-center min-h-[50vh] text-center">
        <CheckCircle2 size={48} className="text-semantic-successText mb-6" />
        <h2 className="mb-4">Order Confirmed</h2>
        <p className="text-muted mb-8 max-w-[400px]">Thank you for your purchase. We've sent a confirmation email and will notify you when it ships.</p>
        <button onClick={() => navigate('/')} className="button dark">Return to Store</button>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page-wrap max-w-[1000px]">
      <span className="eyebrow mb-2">Checkout</span>
      <h1 className="mb-12">Complete your order.</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h3 className="border-b border-line pb-4 mb-2">Contact Information</h3>
            
            <label>
              Phone Number
              <input 
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(555) 555-5555"
                required
              />
            </label>

            <h3 className="border-b border-line pb-4 mb-2 mt-6">Shipping Information</h3>
            
            <label>
              Full Shipping Address
              <textarea 
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="123 Main St, Apt 4B&#10;City, State, ZIP"
                required
              />
            </label>

            <h3 className="border-b border-line pb-4 mb-2 mt-6">Payment</h3>
            <div className="bg-mutedBg p-4 border border-line text-caption text-muted flex items-center gap-3">
              <span className="bg-ink text-white px-2 py-1 font-mono rounded-sm">DEMO</span>
              This is a demonstration. No real payment will be processed.
            </div>
            
            <button type="submit" disabled={loading} className="button dark mt-8">
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div className="lg:col-span-5 bg-card border border-line p-6 self-start sticky top-24">
          <h3 className="mb-6">Order Summary</h3>
          
          <div className="flex flex-col gap-4 mb-6 border-b border-line pb-6">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between text-caption">
                <span className="text-muted">{item.qty}x {item.name}</span>
                <span className="font-mono">${item.price * item.qty}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col gap-2 text-caption mb-6">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-mono">${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tax (8%)</span>
              <span className="font-mono">${tax}</span>
            </div>
          </div>
          
          <div className="flex justify-between text-ui border-t border-line pt-4 font-medium">
            <span>Total</span>
            <span className="font-mono">${total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
