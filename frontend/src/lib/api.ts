const API_BASE = import.meta.env.VITE_API_BASE || '';

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 8000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (attempt === retries) throw err;
      // Only retry on network errors (Render cold start), not on HTTP errors
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

export async function convertFile(file: File, targetFormat: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('target_format', targetFormat);

  const res = await fetchWithRetry(
    `${API_BASE}/api/convert`,
    { method: 'POST', body: formData },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Unknown error' }));
    const message = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
    throw new Error(message);
  }

  return res.json();
}

export async function imagesToPdf(files: File[]) {
  const formData = new FormData();
  for (const f of files) {
    formData.append('files', f);
  }

  const res = await fetchWithRetry(
    `${API_BASE}/api/convert/images-to-pdf`,
    { method: 'POST', body: formData },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Unknown error' }));
    const message = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
    throw new Error(message);
  }

  return res.json();
}

export function getDownloadUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
}
