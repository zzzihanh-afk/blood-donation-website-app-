/**
 * LalBindu Image Compression & Storage Utility
 * 
 * Compresses uploaded ID photographs, badges, and avatars client-side to lightweight
 * JPEG data URLs (< 40 KB) to ensure seamless storage in browser localStorage without
 * exceeding storage quotas or slowing down rendering.
 */

export async function compressImageFile(
  file: File,
  maxWidth = 400,
  maxHeight = 500,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Invalid image file type.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) {
        reject(new Error('Empty image payload.'));
        return;
      }

      const img = new Image();
      img.onerror = () => {
        // Fallback: return raw src if image element fails
        resolve(src);
      };
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          // Scale down maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }

          // Fill white background for transparent PNGs
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Compress to JPEG for ultra-lightweight payload (~15-35KB)
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch (e) {
          console.warn('Canvas compression fallback to raw data URL:', e);
          resolve(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Compress an existing Data URL if it exceeds safe storage limits
 */
export async function compressImageDataUrl(
  dataUrl: string,
  maxWidth = 400,
  maxHeight = 500,
  quality = 0.8
): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl;
  if (dataUrl.length < 50000) return dataUrl; // Already tiny (< ~37KB)

  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(dataUrl);
    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch {
        resolve(dataUrl);
      }
    };
    img.src = dataUrl;
  });
}

/**
 * Safely save item to localStorage with fallback if quota is exceeded
 */
export function safeSetLocalStorage(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    console.warn(`localStorage quota warning on key "${key}":`, err?.message || err);
    // If quota exceeded, attempt to clear non-essential cache and retry
    try {
      localStorage.removeItem('lalbindu_temp_preview');
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
}
