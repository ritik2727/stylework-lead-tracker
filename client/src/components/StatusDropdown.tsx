import React, { useEffect, useRef } from 'react';
import type { LeadStatus } from '../types';
import { STATUS_CONFIG } from '../types';
import './StatusDropdown.css';

interface StatusDropdownProps {
  currentStatus: LeadStatus;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (status: LeadStatus) => void;
}

const ALL_STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL_SENT',
  'WON',
  'LOST',
];

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  isOpen,
  onClose,
  onSelect,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="status-dropdown animate-fade-in" ref={ref}>
      <div className="status-dropdown__header">Change Status</div>
      <div className="status-dropdown__list">
        {ALL_STATUSES.map((status) => {
          const config = STATUS_CONFIG[status];
          const isSelected = status === currentStatus;

          return (
            <button
              key={status}
              type="button"
              className={`status-dropdown__item ${isSelected ? 'status-dropdown__item--selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(status);
                onClose();
              }}
            >
              <span className="status-dropdown__dot" style={{ backgroundColor: config.dot }} />
              <span className="status-dropdown__name">{config.label}</span>
              {isSelected && <span className="status-dropdown__check">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
