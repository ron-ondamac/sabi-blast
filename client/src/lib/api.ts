const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path: string, options?: RequestInit) {
  const res = await fetch(API_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Request failed');
  }
  if (res.status === 204) return undefined;
  return res.json();
}

export function login(email: string, password: string) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function getCurrentUser() {
  return request('/auth/me');
}

export function logout() {
  return request('/auth/logout', { method: 'POST' });
}

export function getRockTypes() {
  return request('/reference/rock-types');
}

export function getExplosiveTypes() {
  return request('/reference/explosive-types');
}

export function designRound(input: any) {
  return request('/rounds/design', { method: 'POST', body: JSON.stringify(input) });
}
