const DOC_CONVERTER_API = 'https://api.docconverter.pro/api/converter/convertdoc';
const CLOUD_CONVERT_API = 'https://api.cloudconvert.com/v2/convert';

export const API_CONFIG = {
  docConverterPro: {
    baseUrl: DOC_CONVERTER_API,
    freeLimit: 1000,
    rateLimit: 2,
  },
  cloudConvert: {
    baseUrl: CLOUD_CONVERT_API,
    freeMinutes: 25,
  },
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const FILE_DELETE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export const ALLOWED_EXTENSIONS = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'],
  document: ['doc', 'docx', 'txt', 'rtf', 'odt'],
  pdf: ['pdf'],
  video: ['mp4', 'avi', 'mov', 'mkv', 'webm'],
  audio: ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac'],
};

export function isAllowedFile(fileName: string, allowedTypes: string[]): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return allowedTypes.includes(ext);
}

export function validateFile(file: File, allowedTypes: string[]): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
  }
  
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!allowedTypes.includes(ext)) {
    return { valid: false, error: `File type .${ext} is not allowed. Allowed: ${allowedTypes.join(', ')}` };
  }
  
  return { valid: true };
}

export function generateFileName(originalName: string, newExtension: string): string {
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  return `${baseName}.${newExtension}`;
}