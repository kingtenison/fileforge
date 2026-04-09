'use client';

import { useState, useRef } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string[];
  maxSize?: number;
  color?: string;
}

export default function FileUploader({ 
  onFileSelect, 
  acceptedTypes,
  maxSize = 10 * 1024 * 1024,
  color = '#06b6d4'
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      return `Invalid file type. Allowed: ${acceptedTypes.map(t => '.' + t).join(', ')}`;
    }
    
    return null;
  };
  
  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    setSelectedFile(file);
    onFileSelect(file);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };
  
  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  if (selectedFile) {
    return (
      <div 
        className="flex items-center justify-between p-4 rounded-xl border hover-lift"
        style={{ 
          background: `linear-gradient(135deg, ${color}15, ${color}08)`,
          borderColor: `${color}30`
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
          >
            ✓
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate max-w-[180px] md:max-w-[200px]">{selectedFile.name}</div>
            <div className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</div>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors flex-shrink-0"
          aria-label="Remove file"
        >
          ×
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative p-6 md:p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all hover-lift ${
          isDragging ? 'scale-[1.02]' : ''
        }`}
        style={{ 
          borderColor: isDragging ? color : 'rgba(255,255,255,0.1)',
          background: isDragging ? `linear-gradient(135deg, ${color}10, ${color}05)` : 'rgba(255,255,255,0.02)'
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload file"
      >
        <div className="flex flex-col items-center text-center">
          <div 
            className="w-12 h-12 mb-4 rounded-2xl flex items-center justify-center text-2xl text-white hover-lift"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
          >
            +
          </div>
          <div className="font-medium mb-1">Drop your file here</div>
          <div className="text-sm text-gray-500">or click to browse</div>
          <div className="text-xs text-gray-600 mt-3">
            Max {formatFileSize(maxSize)} • {acceptedTypes[0].toUpperCase()}+ formats
          </div>
        </div>
        
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          accept={acceptedTypes.map(t => '.' + t).join(',')}
          className="hidden"
        />
      </div>
      
      {error && (
        <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
      )}
    </div>
  );
}