import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  category: '',
  stock: '',
};

function ProductModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const isEdit = Boolean(initial?._id);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('northstar_token');
      const url = isEdit
        ? `http://localhost:5000/api/products/${initial._id}`
        : 'http://localhost:5000/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(isEdit ? 'Product updated!' : 'Product created!', 'success');
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-line w-full max-w-lg rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="text-ui font-semibold m-0">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="icon-button"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-caption text-muted font-medium">
                Product Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Leather Journal"
                className="border border-line bg-mutedBg px-3 py-2 text-ui rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-caption text-muted font-medium">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Short product description..."
                className="border border-line bg-mutedBg px-3 py-2 text-ui rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30 resize-none"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <label className="text-caption text-muted font-medium">
                Price (USD) *
              </label>
              <input
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="29.99"
                className="border border-line bg-mutedBg px-3 py-2 text-ui rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
              />
            </div>

            {/* Stock */}
            <div className="flex flex-col gap-1">
              <label className="text-caption text-muted font-medium">
                Stock Quantity *
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                required
                placeholder="100"
                className="border border-line bg-mutedBg px-3 py-2 text-ui rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="text-caption text-muted font-medium">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="border border-line bg-mutedBg px-3 py-2 text-ui rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
              >
                <option value="">Select category…</option>
                <option value="carry">Carry</option>
                <option value="desk">Desk</option>
                <option value="kitchen">Kitchen</option>
                <option value="outdoors">Outdoors</option>
                <option value="apparel">Apparel</option>
                <option value="tech">Tech</option>
                <option value="home">Home</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-1">
              <label className="text-caption text-muted font-medium">
                Image URL *
              </label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                required
                placeholder="https://images.unsplash.com/..."
                className="border border-line bg-mutedBg px-3 py-2 text-ui rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
              />
            </div>
          </div>

          {/* Image Preview */}
          {form.imageUrl && (
            <div className="rounded-md overflow-hidden aspect-video bg-mutedBg border border-line">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="button"
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="button dark" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', product }
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('northstar_token');
      const res = await fetch('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, [showToast]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products?limit=100');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(data.products);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, [showToast]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchOrders(), fetchProducts()]).finally(() =>
      setLoading(false)
    );
  }, [fetchOrders, fetchProducts]);

  const updateOrderStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('northstar_token');
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      showToast('Order status updated', 'success');
      fetchOrders();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?'))
      return;
    try {
      const token = localStorage.getItem('northstar_token');
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      showToast('Product deleted', 'success');
      fetchProducts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <div className="state">Loading dashboard…</div>;

  return (
    <div className="page-wrap max-w-[1200px]">
      {/* Product modal */}
      {modal && (
        <ProductModal
          initial={modal.mode === 'edit' ? modal.product : null}
          onClose={() => setModal(null)}
          onSaved={fetchProducts}
        />
      )}

      <span className="eyebrow mb-2">Admin</span>
      <h1 className="mb-12">Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-line mb-8">
        {['orders', 'products'].map((tab) => (
          <button
            key={tab}
            className={`pb-4 px-2 text-ui transition-colors font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-ink text-ink'
                : 'text-muted hover:text-ink'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            Manage {tab}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-caption">
            <thead className="text-muted border-b border-line">
              <tr>
                <th className="pb-4 font-normal">Order ID</th>
                <th className="pb-4 font-normal">Date</th>
                <th className="pb-4 font-normal">Customer</th>
                <th className="pb-4 font-normal">Total</th>
                <th className="pb-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-4 font-mono">{order._id.slice(-6)}</td>
                  <td className="py-4 text-muted">
                    {new Date(order.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    {order.user.name}
                    <br />
                    <span className="text-muted">{order.user.email}</span>
                  </td>
                  <td className="py-4 font-mono">${order.total}</td>
                  <td className="py-4">
                    <select
                      className="border border-line bg-card px-2 py-1 text-caption rounded"
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="state py-12">No orders found.</div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted text-caption">
              {products.length} product{products.length !== 1 ? 's' : ''} in catalogue
            </p>
            <button
              className="button dark flex items-center gap-2"
              onClick={() => setModal({ mode: 'add' })}
            >
              <Plus size={16} />
              New Product
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border border-line p-4 bg-card flex flex-col gap-4 rounded-lg"
              >
                <div className="aspect-square bg-mutedBg rounded overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-ui m-0">{product.name}</h4>
                  <div className="flex justify-between text-caption mt-1">
                    <span className="font-mono">${product.price}</span>
                    <span
                      className={
                        product.stock <= 5
                          ? 'text-semantic-errorText font-bold'
                          : 'text-muted'
                      }
                    >
                      Stock: {product.stock}
                    </span>
                  </div>
                  <span className="text-caption text-muted capitalize">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between mt-auto pt-4 border-t border-line">
                  <button
                    className="icon-button flex items-center gap-1 text-caption"
                    onClick={() =>
                      setModal({ mode: 'edit', product })
                    }
                    title="Edit product"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="icon-button !text-semantic-errorText"
                    onClick={() => deleteProduct(product._id)}
                    title="Delete product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
