import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="page-wrap flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="mb-4">Your cart is empty.</h2>
        <p className="text-muted mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/" className="button dark">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page-wrap max-w-[800px]">
      <span className="eyebrow mb-2">Cart</span>
      <h1 className="mb-12">Review your order.</h1>
      
      <div className="flex flex-col gap-6 mb-12">
        {cart.map(item => (
          <div key={item._id} className="flex gap-4 md:gap-6 pb-6 border-b border-line items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-mutedBg flex-shrink-0">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 flex flex-col justify-between self-stretch py-2">
              <div>
                <h3 className="m-0 mb-1">{item.name}</h3>
                <span className="text-caption text-muted font-mono">${item.price}</span>
              </div>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="flex items-center border border-line">
                  <button 
                    onClick={() => updateQuantity(item._id, item.qty - 1, item.stock)} 
                    className="p-2 text-muted hover:text-ink transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-mono text-ui">{item.qty}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.qty + 1, item.stock)} 
                    className="p-2 text-muted hover:text-ink transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item._id)} 
                  className="text-caption text-muted underline hover:text-accent transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
            
            <div className="self-stretch py-2 text-right">
              <span className="font-mono font-medium">${item.price * item.qty}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-line p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-ui text-muted block mb-1">Subtotal</span>
          <span className="text-h2 font-mono">${subtotal}</span>
          <p className="text-caption text-muted mt-2">Taxes and shipping calculated at checkout.</p>
        </div>
        
        <button onClick={() => navigate('/checkout')} className="button dark w-full md:w-auto">
          Proceed to Checkout <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
