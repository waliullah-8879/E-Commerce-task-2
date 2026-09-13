const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
export async function api(path, options = {}) {
  const token = localStorage.getItem('northstar_token');
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }, ...options });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.message || 'Something went wrong');
  return data;
}
