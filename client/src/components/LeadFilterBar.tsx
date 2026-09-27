import React from 'react';
import { Search, X, Download, RotateCcw } from 'lucide-react';
import type { LeadStatus } from '../types';
import './LeadFilterBar.css';

interface LeadFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: LeadStatus | 'ALL';
  onStatusFilterChange: (status: LeadStatus | 'ALL') => void;
  sortBy: 'createdAt' | 'name' | 'email' | 'status';
  onSortByChange: (sort: 'createdAt' | 'name' | 'email' | 'status') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onReset: () => void;
  onExportCsv: () => void;
  totalResults: number;
}

const STATUS_OPTIONS: Array<{ value: LeadStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'PROPOSAL_SENT', label: 'Proposal Sent' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
];

export const LeadFilterBar: React.FC<LeadFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onReset,
  onExportCsv,
  totalResults,
}) => {
  const isFiltered = searchTerm !== '' || statusFilter !== 'ALL';

  return (
    <div className="filter-bar">
      <div className="filter-bar__left">
        {/* Search Input */}
        <div className="filter-bar__search">
          <Search size={16} className="filter-bar__search-icon" />
          <input
            type="text"
            className="filter-bar__search-input"
            placeholder="Search leads by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            id="lead-search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="filter-bar__search-clear"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter Pill Chips */}
        <div className="filter-bar__status-chips">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filter-bar__chip ${
                statusFilter === opt.value ? 'filter-bar__chip--active' : ''
              }`}
              onClick={() => onStatusFilterChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-bar__right">
        {/* Sort Dropdown */}
        <div className="filter-bar__sort">
          <span className="filter-bar__sort-label">Sort by:</span>
          <select
            className="filter-bar__select"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              onSortByChange(sb as any);
              onSortOrderChange(so as any);
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="status-asc">Status</option>
          </select>
        </div>

        {/* Reset Filters button */}
        {isFiltered && (
          <button
            type="button"
            className="filter-bar__action-btn"
            onClick={onReset}
            title="Reset active filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}

        {/* CSV Export button */}
        <button
          type="button"
          className="filter-bar__action-btn"
          onClick={onExportCsv}
          title={`Export ${totalResults} leads to CSV`}
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};
