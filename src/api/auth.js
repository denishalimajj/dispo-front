import { getApiUrl, setToken } from './client';

/**
 * Login with email and password.
 * Backend expects form-urlencoded body (OAuth2PasswordRequestForm: username + password).
 * Returns { access_token, token_type }. Throws on error.
 */
export async function login(email, password) {
  const base = getApiUrl();
  const body = new URLSearchParams({ username: email, password });
  let res;
  try {
    res = await fetch(`${base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
  } catch (e) {
    throw new Error(`Cannot reach server at ${base}. Is the backend running?`);
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const detail = Array.isArray(data.detail) ? data.detail.map((d) => d.msg || d).join(', ') : (data.detail || 'Login failed');
    throw new Error(detail);
  }
  const data = await res.json();
  if (data.access_token) setToken(data.access_token);
  return data;
}

/**
 * Register a new user.
 * Uses same endpoint as Swagger: POST /user/ (Users → create_user).
 * Backend expects JSON: { name, email, password }.
 */
export async function register(name, email, password) {
  const base = getApiUrl();
  let res;
  try {
    res = await fetch(`${base}/user/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
  } catch (e) {
    throw new Error(`Cannot reach server at ${base}. Is the backend running?`);
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const detail = Array.isArray(data.detail) ? data.detail.map((d) => d.msg).join(', ') : (data.detail || 'Registration failed');
    throw new Error(detail);
  }
  return res.json();
}
