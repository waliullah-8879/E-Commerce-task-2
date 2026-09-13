import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, LogOut, Settings } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <header className="topbar">
        <Link to="/" className="brand">
          NORTHSTAR
          <span>SUPPLY CO.</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-caption font-ui font-semibold uppercase tracking-widest text-ink hover:text-accent no-underline transition-colors hidden sm:block">
            Shop
          </Link>
          <div className="h-4 w-[1px] bg-line hidden sm:block"></div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-caption text-muted hidden md:block">Hi, {user.name}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="icon-button" title="Admin Dashboard">
                  <Settings size={18} />
                </Link>
              )}
              <button onClick={logout} className="icon-button" title="Log Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="icon-button" title="Log In">
              <User size={18} />
            </Link>
          )}
          
          <Link to="/cart" className="relative icon-button" title="Cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-line bg-mutedBg mt-auto text-ink">
        <div className="px-[5vw] py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h2 className="brand text-lg mb-4">NORTHSTAR<span className="text-muted">SUPPLY CO.</span></h2>
            <p className="text-muted text-sm max-w-sm mb-6">
              Quality goods for the daily routine and the weekend escape. Built to last, designed for life.
            </p>
          </div>
          <div>
            <h3 className="font-ui font-semibold text-sm mb-4 uppercase tracking-widest">Shop</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted">
              <li><Link to="/" className="hover:text-ink transition-colors">All Products</Link></li>
              <li><span className="cursor-not-allowed">New Arrivals</span></li>
              <li><span className="cursor-not-allowed">Gift Cards</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-ui font-semibold text-sm mb-4 uppercase tracking-widest">Support</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted">
              <li><span className="cursor-not-allowed">FAQ</span></li>
              <li><span className="cursor-not-allowed">Shipping & Returns</span></li>
              <li><span className="cursor-not-allowed">Contact Us</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line px-[5vw] py-6 flex flex-col md:flex-row justify-between items-center text-caption text-muted gap-4">
          <p>&copy; {new Date().getFullYear()} Northstar Supply Co. &mdash; Built for demo.</p>
          <div className="flex gap-6">
            <span className="cursor-not-allowed hover:text-ink transition-colors">Privacy Policy</span>
            <span className="cursor-not-allowed hover:text-ink transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
