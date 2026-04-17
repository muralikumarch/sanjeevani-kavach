'use client';

import React from 'react';

interface StatusBadgeProps {
  status: 'GREEN' | 'YELLOW' | 'RED';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const getStyles = () => {
    switch(status) {
      case 'GREEN': 
        return { bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: 'rgba(16, 185, 129, 0.5)' };
      case 'YELLOW': 
        return { bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.5)' };
      case 'RED': 
        return { bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'rgba(239, 68, 68, 0.5)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.1)', color: 'var(--foreground)', border: 'rgba(255, 255, 255, 0.2)' };
    }
  };

  const s = getStyles();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        textTransform: 'uppercase',
      }}
    >
      {label || status}
    </span>
  );
};
