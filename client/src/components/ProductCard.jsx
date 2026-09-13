import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  
  const inCart = cart.find(item => item._id === product._id)?.qty || 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isMaxedOut = inCart >= product.stock;

  return (
    <div className="group flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden bg-mutedBg">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isOutOfStock && <span className="bg-semantic-errorBg text-semantic-errorText px-2 py-1 text-[10px] font-mono tracking-wider uppercase">Out of Stock</span>}
          {isLowStock && <span className="bg-semantic-warningBg text-semantic-warningText px-2 py-1 text-[10px] font-mono tracking-wider uppercase">Low Stock</span>}
        </div>
      </div>
      
      <div className="flex flex-col flex-1 gap-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-ui font-semibold m-0">{product.name}</h3>
          <span className="text-ui font-mono tracking-tight">${product.price}</span>
        </div>
        <p className="text-caption text-muted m-0 flex-1">{product.category}</p>
        
        <button 
          onClick={() => addToCart(product)}
          disabled={isOutOfStock || isMaxedOut}
          className="button dark full mt-4"
        >
          {isOutOfStock ? 'Sold Out' : isMaxedOut ? 'Max Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
