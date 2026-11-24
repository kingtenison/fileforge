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

export type ToolColor = 'purple' | 'orange' | 'pink' | 'cyan' | 'green' | 'blue' | 'red' | 'yellow' | 'emerald' | 'violet' | 'indigo' | 'teal' | 'fuchsia' | 'amber' | 'rose';

export type ToolCategory = 'image' | 'pdf' | 'document' | 'video' | 'audio';

/** How a tool actually performs the conversion. */
export type ToolEngine =
  | 'image'        // HTML canvas, in the browser
  | 'remove-bg'    // on-device ML model, in the browser
  | 'images-to-pdf'
  | 'pdf-to-image'
  | 'pdf-merge'
  | 'pdf-split'
  | 'pdf-compress'
  | 'image-resize'
  | 'text-to-pdf'
  | 'document'     // server-side document API
  | 'media';       // server-side audio/video API

export type ToolOption = 'quality' | 'dimensions' | 'page' | 'pages';

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolSeo {
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  steps: { name: string; text: string }[];
  benefits: { title: string; text: string }[];
  faqs: ToolFaq[];
  useCases: string[];
}

export interface Tool {
  id: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  inputFormats: string[];
  outputFormat: string;
  category: ToolCategory;
  apiEndpoint: string;
  color: ToolColor;
  engine: ToolEngine;
  /** Allow more than one input file (merge / multi-image PDF). */
  multiFile?: boolean;
  /** Show an extra control above the Convert button. */
  option?: ToolOption;
  /** Curated SEO/AEO copy. Falls back to generated copy when omitted. */
  seo?: Partial<ToolSeo>;
  /** Highlight on the homepage and in related-tool lists. */
  popular?: boolean;
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

export interface ConversionOutput {
  success: boolean;
  outputBlob?: Blob;
  outputExtension?: string;
  error?: string;
}
