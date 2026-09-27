import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination as PaginationType } from '../types';
import './Pagination.css';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
}) => {
  const { page, totalPages, total, limit, hasPrevPage, hasNextPage } = pagination;

  const startRecord = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  // Generate page numbers
  const pages: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <div className="pagination__info">
        Showing <strong>{startRecord}</strong> - <strong>{endRecord}</strong> of{' '}
        <strong>{total}</strong> leads
      </div>

      <div className="pagination__controls">
        <div className="pagination__limit">
          <span className="pagination__limit-label">Rows per page:</span>
          <select
            className="pagination__limit-select"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="pagination__nav">
          <button
            type="button"
            className="pagination__btn pagination__btn--nav"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevPage}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {pages.map((p) => (
            <button
              key={p}
              type="button"
              className={`pagination__btn ${p === page ? 'pagination__btn--active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            className="pagination__btn pagination__btn--nav"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
