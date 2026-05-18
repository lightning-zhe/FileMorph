// VITE_API_BASE is set via .env (dev) or .env.production (prod)
// Dev:  "http://localhost:8000" → direct call
// Prod: "https://api.example.com" → cross-origin
// Empty: "" → relative paths (falls through Vite proxy in dev)
const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function convertFile(file: File, targetFormat: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('target_format', targetFormat);

  const res = await fetch(`${API_BASE}/api/convert`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Unknown error' }));
    const message = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
    throw new Error(message);
  }

  return res.json();
}

export function getDownloadUrl(path: string): string {
  if (path.startsWith('http')) return path;
  // Backend returns /api/download/xxx or relative paths
  return `${API_BASE}${path}`;
}
