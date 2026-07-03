import React from 'react';

export const ToolIcons: Record<string, React.FC> = {
  compress: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" />
      <line x1="3" y1="3" x2="9" y2="9" /><line x1="21" y1="21" x2="15" y2="15" />
    </svg>
  ),
  'jpg-webp': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="8" height="8" rx="1" /><text x="3" y="10" fontSize="5" fill="currentColor" stroke="none">J</text>
      <rect x="14" y="12" width="8" height="8" rx="1" /><text x="15" y="18" fontSize="5" fill="currentColor" stroke="none">W</text>
      <path d="M10 8l4 4" /><path d="M14 8l-4 4" />
    </svg>
  ),
  'webp-jpg': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="8" height="8" rx="1" /><text x="3" y="10" fontSize="5" fill="currentColor" stroke="none">W</text>
      <rect x="14" y="12" width="8" height="8" rx="1" /><text x="15" y="18" fontSize="5" fill="currentColor" stroke="none">J</text>
      <path d="M10 8l4 4" /><path d="M14 8l-4 4" />
    </svg>
  ),
  'png-jpg': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="8" height="8" rx="1" /><text x="3" y="10" fontSize="5" fill="currentColor" stroke="none">P</text>
      <rect x="14" y="12" width="8" height="8" rx="1" /><text x="15" y="18" fontSize="5" fill="currentColor" stroke="none">J</text>
      <path d="M6 12v2" /><path d="M18 10v-2" />
    </svg>
  ),
  'jpg-png': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="8" height="8" rx="1" /><text x="3" y="10" fontSize="5" fill="currentColor" stroke="none">J</text>
      <rect x="14" y="12" width="8" height="8" rx="1" /><text x="15" y="18" fontSize="5" fill="currentColor" stroke="none">P</text>
      <path d="M6 12v2" /><path d="M18 10v-2" />
    </svg>
  ),
  'png-webp': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="8" height="8" rx="1" /><text x="3" y="10" fontSize="5" fill="currentColor" stroke="none">P</text>
      <rect x="14" y="12" width="8" height="8" rx="1" /><text x="15" y="18" fontSize="5" fill="currentColor" stroke="none">W</text>
      <path d="M10 8l4 4" /><path d="M14 8l-4 4" />
    </svg>
  ),
  eraser: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20H7l-5-5 9-9 9 9-2 2" /><path d="M17 7l-3 3" />
      <circle cx="18" cy="18" r="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" />
    </svg>
  ),
  'word-pdf': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <text x="8" y="17" fontSize="9" fill="currentColor" stroke="none" fontWeight="bold">W</text>
      <path d="M8 17h8" opacity="0.3" />
    </svg>
  ),
  'pdf-word': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <rect x="8" y="13" width="8" height="4" rx="0.5" fill="currentColor" fillOpacity="0.1" />
      <text x="9" y="16" fontSize="7" fill="currentColor" stroke="none">DOC</text>
    </svg>
  ),
  'excel-pdf': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  ),
  'ppt-pdf': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 17l1-4h4l1 4" />
    </svg>
  ),
  'txt-pdf': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="14" y2="17" />
      <text x="8.5" y="22.5" fontSize="6" fill="currentColor" stroke="none">TXT</text>
    </svg>
  ),
  // Video icons
  'mp4-webm': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
      <text x="2" y="19" fontSize="5" fill="currentColor" stroke="none" fontWeight="bold">MP4</text>
    </svg>
  ),
  'video-convert': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
      <path d="M7 10l3 2-3 2v-4z" />
    </svg>
  ),
  'video-mp3': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
      <path d="M8 19v-7l3 2-3 2z" opacity="0.4" />
      <circle cx="8" cy="15" r="4" fill="currentColor" fillOpacity="0.08" />
    </svg>
  ),
  'audio-convert': () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
      <path d="M9 5l12-2" opacity="0.3" />
    </svg>
  ),
};
