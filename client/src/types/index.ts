export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL_SENT'
  | 'WON'
  | 'LOST';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  company?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
  company?: string;
  notes?: string;
}

export interface UpdateLeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
  company?: string;
  notes?: string;
}

export interface LeadQueryParams {
  search?: string;
  status?: LeadStatus | 'ALL';
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'status' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  conversionRate: number;
  newThisWeek: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  message?: string;
  error?: {
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  NEW: {
    label: 'New Lead',
    color: '#2563eb',
    bg: 'rgba(37, 99, 235, 0.1)',
    border: 'rgba(37, 99, 235, 0.3)',
    dot: '#3b82f6',
  },
  CONTACTED: {
    label: 'Contacted',
    color: '#0891b2',
    bg: 'rgba(8, 145, 178, 0.1)',
    border: 'rgba(8, 145, 178, 0.3)',
    dot: '#06b6d4',
  },
  QUALIFIED: {
    label: 'Qualified',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.1)',
    border: 'rgba(139, 92, 246, 0.3)',
    dot: '#a855f7',
  },
  PROPOSAL_SENT: {
    label: 'Proposal Sent',
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.1)',
    border: 'rgba(217, 119, 6, 0.3)',
    dot: '#f59e0b',
  },
  WON: {
    label: 'Won (Closed)',
    color: '#16a34a',
    bg: 'rgba(22, 163, 74, 0.12)',
    border: 'rgba(22, 163, 74, 0.35)',
    dot: '#22c55e',
  },
  LOST: {
    label: 'Lost',
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.1)',
    border: 'rgba(220, 38, 38, 0.3)',
    dot: '#ef4444',
  },
};
