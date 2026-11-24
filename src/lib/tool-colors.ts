import type { ToolColor } from './types';

export interface ToolStyle {
  primary: string;
  secondary: string;
  gradient: string;
  glow: string;
  cardClass: string;
  glowRgba: string;
}

const palette: Record<ToolColor, ToolStyle> = {
  purple: { primary: '#a78bfa', secondary: '#7c3aed', gradient: 'from-violet-400 to-purple-500', glow: 'rgba(139,92,246,0.5)', cardClass: 'card-violet', glowRgba: 'rgba(139,92,246,0.25)' },
  orange: { primary: '#fb923c', secondary: '#ea580c', gradient: 'from-orange-400 to-orange-600', glow: 'rgba(249,115,22,0.5)', cardClass: 'card-orange', glowRgba: 'rgba(249,115,22,0.25)' },
  pink: { primary: '#f472b6', secondary: '#db2777', gradient: 'from-pink-400 to-pink-600', glow: 'rgba(236,72,153,0.5)', cardClass: 'card-pink', glowRgba: 'rgba(236,72,153,0.25)' },
  cyan: { primary: '#22d3ee', secondary: '#0891b2', gradient: 'from-cyan-400 to-cyan-600', glow: 'rgba(6,182,212,0.5)', cardClass: 'card-cyan', glowRgba: 'rgba(6,182,212,0.25)' },
  green: { primary: '#34d399', secondary: '#059669', gradient: 'from-emerald-400 to-emerald-600', glow: 'rgba(16,185,129,0.5)', cardClass: 'card-green', glowRgba: 'rgba(16,185,129,0.25)' },
  blue: { primary: '#60a5fa', secondary: '#2563eb', gradient: 'from-blue-400 to-blue-600', glow: 'rgba(59,130,246,0.5)', cardClass: 'card-blue', glowRgba: 'rgba(59,130,246,0.25)' },
  red: { primary: '#f87171', secondary: '#dc2626', gradient: 'from-red-400 to-red-600', glow: 'rgba(239,68,68,0.5)', cardClass: 'card-rose', glowRgba: 'rgba(239,68,68,0.25)' },
  yellow: { primary: '#facc15', secondary: '#ca8a04', gradient: 'from-yellow-400 to-yellow-600', glow: 'rgba(234,179,8,0.5)', cardClass: 'card-amber', glowRgba: 'rgba(234,179,8,0.25)' },
  emerald: { primary: '#34d399', secondary: '#047857', gradient: 'from-emerald-400 to-emerald-600', glow: 'rgba(16,185,129,0.5)', cardClass: 'card-emerald', glowRgba: 'rgba(16,185,129,0.25)' },
  violet: { primary: '#a78bfa', secondary: '#6d28d9', gradient: 'from-violet-400 to-violet-600', glow: 'rgba(139,92,246,0.5)', cardClass: 'card-violet', glowRgba: 'rgba(139,92,246,0.25)' },
  indigo: { primary: '#818cf8', secondary: '#4f46e5', gradient: 'from-indigo-400 to-indigo-600', glow: 'rgba(99,102,241,0.5)', cardClass: 'card-indigo', glowRgba: 'rgba(99,102,241,0.25)' },
  teal: { primary: '#2dd4bf', secondary: '#0d9488', gradient: 'from-teal-400 to-teal-600', glow: 'rgba(20,184,166,0.5)', cardClass: 'card-teal', glowRgba: 'rgba(20,184,166,0.25)' },
  fuchsia: { primary: '#d946ef', secondary: '#a21caf', gradient: 'from-fuchsia-400 to-fuchsia-600', glow: 'rgba(217,70,239,0.5)', cardClass: 'card-fuchsia', glowRgba: 'rgba(217,70,239,0.25)' },
  amber: { primary: '#fbbf24', secondary: '#b45309', gradient: 'from-amber-400 to-amber-600', glow: 'rgba(245,158,11,0.5)', cardClass: 'card-amber', glowRgba: 'rgba(245,158,11,0.25)' },
  rose: { primary: '#fb7185', secondary: '#be123c', gradient: 'from-rose-400 to-rose-600', glow: 'rgba(244,63,94,0.5)', cardClass: 'card-rose', glowRgba: 'rgba(244,63,94,0.25)' },
};

/** Per-tool overrides keep the original look of the most popular tools. */
const overrides: Record<string, ToolColor> = {
  'image-compress': 'cyan',
  'jpg-to-webp': 'orange',
  'webp-to-jpg': 'pink',
  'png-to-jpg': 'purple',
  'jpg-to-png': 'green',
  'png-to-webp': 'blue',
  'background-eraser': 'fuchsia',
  'word-to-pdf': 'blue',
  'pdf-to-word': 'amber',
  'excel-to-pdf': 'emerald',
  'ppt-to-pdf': 'rose',
  'txt-to-pdf': 'teal',
  'mp4-to-webm': 'cyan',
  'avi-to-mp4': 'orange',
  'mov-to-mp4': 'pink',
  'mkv-to-webm': 'violet',
  'mp3-to-wav': 'green',
  'wav-to-mp3': 'blue',
  'mp3-to-aac': 'fuchsia',
  'mp3-to-ogg': 'amber',
  'mp4-to-mp3': 'rose',
  'image-to-pdf': 'red',
  'jpg-to-pdf': 'orange',
  'png-to-pdf': 'blue',
  'webp-to-pdf': 'orange',
  'pdf-to-jpg': 'pink',
  'pdf-to-png': 'cyan',
  'pdf-merge': 'indigo',
  'pdf-split': 'violet',
  'pdf-compress': 'green',
  'image-resize': 'teal',
  'm4a-to-mp3': 'amber',
  'webm-to-mp4': 'cyan',
};

export function getToolColor(id: string): ToolColor {
  return overrides[id] || 'cyan';
}

export function getToolStyle(id: string): ToolStyle {
  return palette[getToolColor(id)];
}

/** Tailwind-safe class map used by the tool card grid. */
export const cardClasses: Record<string, string> = Object.fromEntries(
  Object.entries(palette).map(([key, value]) => [key, value.cardClass]),
);
