/**
 * API base URL from env. Used for all backend requests.
 */
export const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Get stored access token for authenticated requests.
 */
export const getToken = () => localStorage.getItem('access_token');

/**
 * Save token after login.
 */
export const setToken = (token) => {
  if (token) localStorage.setItem('access_token', token);
};

/**
 * Remove token on logout.
 */
export const clearToken = () => localStorage.removeItem('access_token');
