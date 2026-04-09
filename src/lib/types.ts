export interface ConversionResult {
  success: boolean;
  outputUrl?: string;
  error?: string;
  fileName?: string;
}

export interface ConversionRequest {
  file: File;
  options?: Record<string, string | number | boolean>;
}

export type ToolColor = 'purple' | 'orange' | 'pink' | 'cyan' | 'green' | 'blue' | 'red' | 'yellow' | 'emerald' | 'violet' | 'indigo' | 'teal';

export interface Tool {
  id: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  inputFormats: string[];
  outputFormat: string;
  category: 'image' | 'pdf' | 'document' | 'video' | 'audio';
  apiEndpoint: string;
  color: ToolColor;
}

export interface ConversionJob {
  id: string;
  toolId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  inputFileName: string;
  outputFileName?: string;
  createdAt: Date;
  expiresAt: Date;
}
