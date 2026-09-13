const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
export async function api(path, options = {}) {
  const token = localStorage.getItem('northstar_token');
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }, ...options });
  
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = response.status === 204 ? null : (isJson ? await response.json() : null);
  
  if (!response.ok) {
    if (data && data.message) throw new Error(data.message);
    const text = await response.text();
    throw new Error(text || 'A server error occurred');
  }
  
  return data;
}
