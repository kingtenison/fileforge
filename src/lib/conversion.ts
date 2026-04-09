export function downloadFile(url: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getMimeType(format: string): string {
  switch (format.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

function getExtension(format: string): string {
  switch (format.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'jpg';
    case 'png':
      return 'png';
    case 'webp':
      return 'webp';
    case 'gif':
      return 'gif';
    default:
      return 'jpg';
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, mimeType, quality);
  });
}

export async function compressImageClientSide(
  file: File,
  quality: number = 0.8
): Promise<{ success: boolean; outputBlob?: Blob; outputExtension?: string; error?: string }> {
  try {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const imgLoadPromise = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
    });
    
    img.src = URL.createObjectURL(file);
    await imgLoadPromise;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
    
    const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
    
    if (blob) {
      return { 
        success: true, 
        outputBlob: blob,
        outputExtension: 'jpg'
      };
    }
    return { success: false, error: 'Compression failed - no blob' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function convertImageClientSide(
  file: File,
  outputFormat: 'jpg' | 'png' | 'webp',
  quality: number = 0.9
): Promise<{ success: boolean; outputBlob?: Blob; outputExtension?: string; error?: string }> {
  try {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const imgLoadPromise = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
    });
    
    img.src = URL.createObjectURL(file);
    await imgLoadPromise;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    if (ctx) {
      if (outputFormat === 'jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
    }
    
    const mimeType = getMimeType(outputFormat);
    const blob = await canvasToBlob(canvas, mimeType, quality);
    
    if (blob) {
      return { 
        success: true, 
        outputBlob: blob,
        outputExtension: getExtension(outputFormat)
      };
    }
    return { success: false, error: 'Conversion failed - no blob' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
