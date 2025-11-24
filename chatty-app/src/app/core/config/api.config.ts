export const API_BASE_URL = 'http://localhost:5249/api';

// Build hub URL from the API origin so we always hit the backend (not the dev server).
export function getHubUrl() {
  try {
    const api = new URL(API_BASE_URL);
    return `${api.protocol}//${api.host}/hubs/chat`;
  } catch {
    return API_BASE_URL.replace('/api', '/hubs/chat');
  }
}
