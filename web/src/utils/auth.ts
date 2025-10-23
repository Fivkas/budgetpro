export function getAuthHeader() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/auth/login';
}
