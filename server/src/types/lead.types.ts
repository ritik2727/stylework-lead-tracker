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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
  company?: string | null;
  notes?: string | null;
}

export interface UpdateLeadStatusInput {
  status: LeadStatus;
}

export interface UpdateLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
  company?: string | null;
  notes?: string | null;
}

export interface LeadQueryFilters {
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
  conversionRate: number; // percentage of WON over total
  newThisWeek: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
