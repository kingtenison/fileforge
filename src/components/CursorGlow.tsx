'use client';

import { useState, useEffect, useCallback } from 'react';

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [color, setColor] = useState('#22d3ee');

  const colors = ['#22d3ee', '#a855f7', '#f472b6', '#fb923c', '#34d399', '#60a5fa'];

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: '2px',
        height: '2px',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        boxShadow: `0 0 60px 20px ${color}`,
        transition: 'box-shadow 0.1s ease',
      }}
    />
  );
}
