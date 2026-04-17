'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ 
  children, 
  variant = 'secondary', 
  fullWidth = false, 
  className = '', 
  style,
  disabled,
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileFocus={{ scale: 1.02, outline: '2px solid #a855f7', outlineOffset: '2px' }}
      aria-disabled={disabled}
      role="button"
      style={{
        width: fullWidth ? '100%' : 'auto',
        ...(variant === 'danger' ? { 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.9))',
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
          color: 'white',
        } : {}),
        ...style
      }}
      className={`glass-button ${variant === 'secondary' ? 'secondary' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
