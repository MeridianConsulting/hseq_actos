/**
 * Utilidad de descarga de archivos: blob a disco y fetch con reintentos.
 * Sin cambiar UI ni lógica de negocio; solo robustez (timeout, retries, revoke).
 */

const DEFAULT_DOWNLOAD_TIMEOUT_MS = 60000;
const DEFAULT_RETRIES = 2;
const RETRY_DELAY_MS = 800;

/**
 * Obtiene un header de un objeto (axios-style) de forma case-insensitive.
 * @param {Record<string, string>} headers
 * @param {string} name
 * @returns {string}
 */
export function getHeader(headers, name) {
  if (!headers || typeof headers !== 'object') return '';
  const n = String(name).toLowerCase();
  for (const k of Object.keys(headers)) {
    if (k.toLowerCase() === n) return headers[k] || '';
  }
  return '';
}

/**
 * Descarga un Blob con nombre sugerido y libera la URL después (revoke).
 * @param {Blob} blob
 * @param {string} suggestedFileName
 * @param {string} [contentType]
 */
export function downloadBlob(blob, suggestedFileName, contentType) {
  if (!blob || !(blob instanceof Blob)) return;
  const fileName = sanitizeFileName(suggestedFileName || 'download');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => {
    try { URL.revokeObjectURL(url); } catch (_) {}
  }, 500);
}

/**
 * Sanitiza nombre de archivo para descarga (evitar caracteres inválidos).
 * @param {string} name
 * @returns {string}
 */
function sanitizeFileName(name) {
  return String(name || 'download')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .trim() || 'download';
}

/**
 * Descarga un archivo desde URL con fetch, timeout y reintentos (solo para descargas).
 * @param {string} url - URL completa (incl. API base si aplica)
 * @param {string} suggestedFileName
 * @param {{ headers?: Record<string, string>; timeoutMs?: number; retries?: number }} [options]
 * @returns {Promise<void>}
 */
export async function downloadFileWithRetry(url, suggestedFileName, options = {}) {
  const timeoutMs = options.timeoutMs ?? DEFAULT_DOWNLOAD_TIMEOUT_MS;
  const retries = options.retries ?? DEFAULT_RETRIES;
  const headers = options.headers || {};
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      const resp = await fetch(url, {
        method: 'GET',
        headers: { Accept: '*/*', ...headers },
        credentials: 'include',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!resp.ok) {
        if (resp.status >= 500 && attempt < retries) {
          await delay(RETRY_DELAY_MS * (attempt + 1));
          continue;
        }
        throw new Error(`HTTP ${resp.status}`);
      }
      const blob = await resp.blob();
      const disp = resp.headers.get('content-disposition') || '';
      const match = /filename="?([^";\n]+)"?/i.exec(disp);
      const fileName = match && match[1]
        ? sanitizeFileName(decodeURIComponent(match[1].trim()))
        : sanitizeFileName(suggestedFileName);
      downloadBlob(blob, fileName, resp.headers.get('content-type') || undefined);
      return;
    } catch (e) {
      lastError = e;
      const isRetryable = e.name === 'AbortError' || (e.message && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError'))) || (e.response && e.response.status >= 500);
      if (isRetryable && attempt < retries) {
        await delay(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }
      throw lastError;
    }
  }
  throw lastError;
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default { downloadBlob, downloadFileWithRetry, getHeader };
