'use client';

import { useState, useRef } from 'react';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  acceptedTypes: string[];
  maxSize?: number;
  color?: string;
  multiple?: boolean;
}

export default function FileUploader({
  onFileSelect,
  acceptedTypes,
  maxSize = 50 * 1024 * 1024,
  color = '#06b6d4',
  multiple = false,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File is too large. Maximum size is ${formatFileSize(maxSize)}`;
    }
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!acceptedTypes.includes(ext)) {
      return `Invalid file type. Allowed: ${acceptedTypes.map((t) => '.' + t).join(', ')}`;
    }
    return null;
  };

  const handleFiles = (incoming: File[]) => {
    const errors: string[] = [];
    const valid: File[] = [];
    for (const file of incoming) {
      const validationError = validateFile(file);
      if (validationError) errors.push(`${file.name}: ${validationError}`);
      else valid.push(file);
    }
    if (errors.length) {
      setError(errors.join(' '));
      return;
    }
    if (!valid.length) return;
    setError(null);
    const next = multiple ? [...selectedFiles, ...valid] : [valid[0]];
    setSelectedFiles(next);
    onFileSelect(next);
  };

  const handleRemove = (index?: number) => {
    const next = index === undefined ? [] : selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(next);
    setError(null);
    onFileSelect(next);
    if (inputRef.current && !next.length) inputRef.current.value = '';
  };

  const hasFiles = selectedFiles.length > 0;

  return (
    <div>
      {hasFiles && (
        <div className="mb-3 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-4 rounded-xl border bg-white"
              style={{ borderColor: `${color}30` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center text-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                  aria-hidden="true"
                >
                  ✓
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm text-gray-800 truncate max-w-[180px] md:max-w-[260px]">{file.name}</div>
                  <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0 rounded-lg hover:bg-gray-100"
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
            </div>
          ))}
          {multiple && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs font-medium hover:underline"
              style={{ color }}
            >
              + Add more files
            </button>
          )}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(Array.from(e.dataTransfer.files));
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`relative p-6 md:p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all hover-lift bg-white ${isDragging ? 'scale-[1.02]' : ''}`}
        style={{
          borderColor: isDragging ? color : 'rgba(0,0,0,0.08)',
          background: isDragging ? `linear-gradient(135deg, ${color}08, ${color}03)` : 'white',
        }}
        role="button"
        tabIndex={0}
        aria-label={multiple ? 'Upload files' : 'Upload file'}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="w-12 h-12 mb-4 rounded-2xl flex items-center justify-center text-2xl text-white shadow-sm"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
            aria-hidden="true"
          >
            +
          </div>
          <div className="font-heading font-semibold text-sm text-gray-700 mb-1">
            Drop your {multiple ? 'files' : 'file'} here
          </div>
          <div className="text-sm text-gray-400">or click to browse</div>
          <div className="text-xs text-gray-400 mt-3">
            Max {formatFileSize(maxSize)} per file • {acceptedTypes.map((t) => t.toUpperCase()).slice(0, 4).join(', ')}{acceptedTypes.length > 4 ? '+' : ''}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
          accept={acceptedTypes.map((t) => '.' + t).join(',')}
          className="hidden"
          aria-label="Choose files to convert"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center font-medium" role="alert">{error}</p>
      )}
    </div>
  );
}
