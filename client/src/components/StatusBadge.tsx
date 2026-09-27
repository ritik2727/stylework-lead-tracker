import React from 'react';
import type { LeadStatus } from '../types';
import { STATUS_CONFIG } from '../types';
import './StatusBadge.css';

interface StatusBadgeProps {
  status: LeadStatus;
  interactive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  interactive = false,
  onClick,
  size = 'md',
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;

  return (
    <span
      className={`status-badge status-badge--${size} ${interactive ? 'status-badge--interactive' : ''}`}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        borderColor: config.border,
      }}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <span className="status-badge__dot" style={{ backgroundColor: config.dot }} />
      <span className="status-badge__label">{config.label}</span>
      {interactive && <span className="status-badge__caret">▾</span>}
    </span>
  );
};
