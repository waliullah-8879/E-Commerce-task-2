import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('northstar_cart');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        } else {
          setCart([]);
        }
      } catch (e) { 
        console.error('Failed to parse cart'); 
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('northstar_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is out of stock.`, 'error');
      return;
    }
    
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        if (existing.qty >= product.stock) {
          showToast(`Cannot add more. Only ${product.stock} in stock.`, 'warning');
          return prev;
        }
        showToast(`Added another ${product.name} to cart.`, 'success');
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      showToast(`${product.name} added to cart.`, 'success');
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQuantity = (id, newQty, maxStock) => {
    if (newQty < 1) return;
    if (newQty > maxStock) {
      showToast(`Cannot update. Only ${maxStock} in stock.`, 'warning');
      return;
    }
    setCart((prev) => prev.map((item) => (item._id === id ? { ...item, qty: newQty } : item)));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
