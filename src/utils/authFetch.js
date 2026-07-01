import { getMemoryToken } from '@/providers/AuthProvider';

/**
 * Wrapper around fetch that automatically adds Authorization header
 * for cross-domain API calls in production
 */
export async function authFetch(url, options = {}) {
  const token = getMemoryToken();

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });
}