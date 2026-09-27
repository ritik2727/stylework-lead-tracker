import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from './services/api';
import type { Lead, LeadStats, LeadStatus, Pagination as PaginationType } from './types';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { LeadFilterBar } from './components/LeadFilterBar';
import { LeadTable } from './components/LeadTable';
import { LeadKanban } from './components/LeadKanban';
import { Pagination } from './components/Pagination';
import { LeadModal } from './components/LeadModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import './App.css';

export function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('stylework_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stylework_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // View state: 'table' or 'kanban'
  const [activeView, setActiveView] = useState<'table' | 'kanban'>('table');

  // Backend connection status
  const [backendOnline, setBackendOnline] = useState(false);

  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Filter & Pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'email' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Debounce search term by 300ms
  const searchTimeoutRef = useRef<any>(null);
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Check backend health
  const checkBackendHealth = useCallback(async () => {
    try {
      const res = await fetch('/health');
      if (res.ok) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  }, []);

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 15000);
    return () => clearInterval(interval);
  }, [checkBackendHealth]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const data = await api.getLeadStats();
      setStats(data);
      setBackendOnline(true);
    } catch (err: any) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Leads
  const fetchLeads = useCallback(async () => {
    try {
      setLoadingLeads(true);
      const limitToUse = activeView === 'kanban' ? 100 : pagination.limit;
      const res = await api.getLeads({
        search: debouncedSearch,
        status: statusFilter,
        page: activeView === 'kanban' ? 1 : pagination.page,
        limit: limitToUse,
        sortBy,
        sortOrder,
      });
      setLeads(res.data);
      if (res.pagination) {
        setPagination(res.pagination);
      }
      setBackendOnline(true);
    } catch (err: any) {
      console.error('Failed to load leads:', err);
      addToast('error', err.message || 'Failed to fetch leads from server');
    } finally {
      setLoadingLeads(false);
    }
  }, [debouncedSearch, statusFilter, pagination.page, pagination.limit, sortBy, sortOrder, activeView]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handlers for Lead CRUD
  const handleCreateOrUpdateLead = async (payload: any) => {
    if (leadToEdit) {
      await api.updateLead(leadToEdit.id, payload);
      addToast('success', `Lead "${payload.name}" updated successfully`);
    } else {
      await api.createLead(payload);
      addToast('success', `Lead "${payload.name}" added to pipeline`);
    }
    fetchLeads();
    fetchStats();
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      // Optimistic update for instant feel
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
      );
      await api.updateLeadStatus(id, newStatus);
      addToast('info', `Lead status updated to ${newStatus}`);
      fetchStats();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update status');
      fetchLeads(); // rollback
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await api.deleteLead(id);
      addToast('success', 'Lead successfully deleted');
      setLeadToDelete(null);
      fetchLeads();
      fetchStats();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete lead');
    }
  };

  const handleExportCsv = () => {
    if (leads.length === 0) {
      addToast('info', 'No leads available to export');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Company', 'Notes', 'Created At'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      l.status,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      l.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `stylework_leads_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', `Exported ${leads.length} leads to CSV`);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setStatusFilter('ALL');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenCreateModal={() => {
          setLeadToEdit(null);
          setIsModalOpen(true);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        backendOnline={backendOnline}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* KPI Metrics */}
        <StatsCards stats={stats} loading={loadingStats} />

        {/* Filters & Actions Bar */}
        <LeadFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={(st) => {
            setStatusFilter(st);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onReset={handleResetFilters}
          onExportCsv={handleExportCsv}
          totalResults={pagination.total}
        />

        {/* View content: Table vs Kanban */}
        {activeView === 'table' ? (
          <div className="view-container">
            <LeadTable
              leads={leads}
              loading={loadingLeads}
              onEdit={(lead) => {
                setLeadToEdit(lead);
                setIsModalOpen(true);
              }}
              onDelete={(lead) => setLeadToDelete(lead)}
              onStatusChange={handleStatusChange}
            />
            {leads.length > 0 && (
              <Pagination
                pagination={pagination}
                onPageChange={(page) =>
                  setPagination((prev) => ({ ...prev, page }))
                }
                onLimitChange={(limit) =>
                  setPagination((prev) => ({ ...prev, limit, page: 1 }))
                }
              />
            )}
          </div>
        ) : (
          <div className="view-container">
            <LeadKanban
              leads={leads}
              loading={loadingLeads}
              onEdit={(lead) => {
                setLeadToEdit(lead);
                setIsModalOpen(true);
              }}
              onDelete={(lead) => setLeadToDelete(lead)}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Stylework Lead Tracker • Built with React, TypeScript, Node.js & PostgreSQL</p>
      </footer>

      {/* Modals & Alerts */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setLeadToEdit(null);
        }}
        onSubmit={handleCreateOrUpdateLead}
        leadToEdit={leadToEdit}
      />

      <DeleteConfirmModal
        isOpen={!!leadToDelete}
        lead={leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={handleDeleteLead}
      />

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
