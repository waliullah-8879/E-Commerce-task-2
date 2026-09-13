import { useEffect, useState, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { useToast } from '../context/ToastContext';
import { Filter, Search } from 'lucide-react';
import { api } from '../lib/api';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { showToast } = useToast();
  // Stable ref so we never need showToast in dep arrays
  const showToastRef = useRef(showToast);
  useEffect(() => { showToastRef.current = showToast; }, [showToast]);

  // Fetch distinct categories once
  useEffect(() => {
    api('/products/categories')
      .then(d => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    // Give a tiny debounce so typing fast doesn't blast the API
    const timeout = setTimeout(() => {
      const params = new URLSearchParams({ page, limit: 8, category, sort });
      if (search) params.append('search', search);

      api(`/products?${params}`)
        .then(d => {
          if (cancelled) return;
          setProducts(d.products || []);
          setTotalPages(d.pagination?.pages || 1);
        })
        .catch(err => {
          if (!cancelled) showToastRef.current(err.message, 'error');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);

    return () => { 
      cancelled = true; 
      clearTimeout(timeout);
    };
  }, [category, sort, page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="page-wrap">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="eyebrow mb-2">Collection</span>
          <h1 className="m-0">Goods for the daily routine.</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              type="text"
              placeholder="Search products…"
              className="w-full pl-10 py-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2 border border-line bg-card px-3 py-2">
            <Filter size={16} className="text-muted" />
            <select
              className="border-none bg-transparent p-0 text-sm min-w-[110px] outline-none"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>

          <select
            className="border border-line bg-card px-3 py-2 text-sm outline-none"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div className="state">Loading collection…</div>
      ) : products.length === 0 ? (
        <div className="state">No products found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-16">
              <button
                className="button border border-line"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                ← Previous
              </button>
              <span className="text-caption font-mono text-muted">{page} / {totalPages}</span>
              <button
                className="button border border-line"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
