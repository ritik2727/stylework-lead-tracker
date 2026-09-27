import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusBadge } from '../components/StatusBadge';
import { StatsCards } from '../components/StatsCards';
import { LeadFilterBar } from '../components/LeadFilterBar';
import { LeadTable } from '../components/LeadTable';
import type { Lead, LeadStats } from '../types';

describe('Frontend Component Tests', () => {
  describe('StatusBadge', () => {
    it('renders correct label for NEW status', () => {
      render(<StatusBadge status="NEW" />);
      expect(screen.getByText('New Lead')).toBeInTheDocument();
    });

    it('renders correct label for WON status', () => {
      render(<StatusBadge status="WON" />);
      expect(screen.getByText('Won (Closed)')).toBeInTheDocument();
    });

    it('renders interactive caret when interactive prop is true', () => {
      render(<StatusBadge status="QUALIFIED" interactive />);
      expect(screen.getByText('Qualified')).toBeInTheDocument();
      expect(screen.getByText('▾')).toBeInTheDocument();
    });
  });

  describe('StatsCards', () => {
    const mockStats: LeadStats = {
      total: 24,
      byStatus: {
        NEW: 8,
        CONTACTED: 6,
        QUALIFIED: 4,
        PROPOSAL_SENT: 2,
        WON: 3,
        LOST: 1,
      },
      conversionRate: 12.5,
      newThisWeek: 5,
    };

    it('renders all 4 metrics correctly', () => {
      render(<StatsCards stats={mockStats} loading={false} />);
      expect(screen.getByText('24')).toBeInTheDocument(); // total
      expect(screen.getByText('+5 new this week')).toBeInTheDocument();
      expect(screen.getByText('12.5%')).toBeInTheDocument(); // conversion rate
      expect(screen.getByText('3')).toBeInTheDocument(); // won count
    });
  });

  describe('LeadFilterBar', () => {
    it('calls onSearchChange when typing in search input', () => {
      const handleSearchChange = vi.fn();
      render(
        <LeadFilterBar
          searchTerm=""
          onSearchChange={handleSearchChange}
          statusFilter="ALL"
          onStatusFilterChange={vi.fn()}
          sortBy="createdAt"
          onSortByChange={vi.fn()}
          sortOrder="desc"
          onSortOrderChange={vi.fn()}
          onReset={vi.fn()}
          onExportCsv={vi.fn()}
          totalResults={10}
        />
      );

      const input = screen.getByPlaceholderText(/search leads by name/i);
      fireEvent.change(input, { target: { value: 'Aarav' } });
      expect(handleSearchChange).toHaveBeenCalledWith('Aarav');
    });

    it('calls onStatusFilterChange when clicking status chip', () => {
      const handleStatusChange = vi.fn();
      render(
        <LeadFilterBar
          searchTerm=""
          onSearchChange={vi.fn()}
          statusFilter="ALL"
          onStatusFilterChange={handleStatusChange}
          sortBy="createdAt"
          onSortByChange={vi.fn()}
          sortOrder="desc"
          onSortOrderChange={vi.fn()}
          onReset={vi.fn()}
          onExportCsv={vi.fn()}
          totalResults={10}
        />
      );

      const wonChip = screen.getByText('Won');
      fireEvent.click(wonChip);
      expect(handleStatusChange).toHaveBeenCalledWith('WON');
    });
  });

  describe('LeadTable', () => {
    const mockLeads: Lead[] = [
      {
        id: 'lead-1',
        name: 'Aarav Sharma',
        email: 'aarav@techcorp.in',
        phone: '+91 98765 43210',
        status: 'NEW',
        company: 'TechCorp Solutions',
        notes: '20 desks',
        createdAt: '2026-09-20T10:00:00Z',
        updatedAt: '2026-09-20T10:00:00Z',
      },
    ];

    it('renders lead data in table rows', () => {
      render(
        <LeadTable
          leads={mockLeads}
          loading={false}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onStatusChange={vi.fn()}
        />
      );

      expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
      expect(screen.getByText('TechCorp Solutions')).toBeInTheDocument();
      expect(screen.getByText('aarav@techcorp.in')).toBeInTheDocument();
      expect(screen.getByText('+91 98765 43210')).toBeInTheDocument();
    });

    it('renders empty state when no leads provided', () => {
      render(
        <LeadTable
          leads={[]}
          loading={false}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onStatusChange={vi.fn()}
        />
      );

      expect(screen.getByText('No Leads Found')).toBeInTheDocument();
    });
  });
});
