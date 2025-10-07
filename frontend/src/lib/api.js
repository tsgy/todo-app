const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  // 204 No Content 対応
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  listTodos: () => request('/todos'),
  createTodo: (payload) =>
    request('/todos', { method: 'POST', body: JSON.stringify(payload) }),
  updateTodo: (id, payload) =>
    request(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteTodo: (id) => request(`/todos/${id}`, { method: 'DELETE' }),
};
