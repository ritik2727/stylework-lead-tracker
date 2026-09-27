import type {
  ApiResponse,
  CreateLeadPayload,
  Lead,
  LeadQueryParams,
  LeadStats,
  LeadStatus,
  UpdateLeadPayload,
} from '../types';

const getApiBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL || '/api').trim();
  const clean = envUrl.replace(/\/+$/, '');
  if (clean.startsWith('http') && !clean.endsWith('/api') && !clean.endsWith('/leads')) {
    return `${clean}/api`;
  }
  return clean;
};

const BASE_URL = getApiBaseUrl();

class ApiError extends Error {
  details?: Array<{ field: string; message: string }>;

  constructor(message: string, details?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiError';
    this.details = details;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json: ApiResponse<T> = await res.json().catch(() => ({
    success: false,
    data: null as any,
    error: { message: `HTTP Error ${res.status}: ${res.statusText}` },
  }));

  if (!res.ok || !json.success) {
    const errorMsg = json.error?.message || `Request failed with status ${res.status}`;
    throw new ApiError(errorMsg, json.error?.details);
  }

  return json as unknown as T;
}

export const api = {
  /**
   * Healthcheck
   */
  async checkHealth(): Promise<boolean> {
    try {
      const healthUrl = BASE_URL.endsWith('/api')
        ? `${BASE_URL.slice(0, -4)}/health`
        : `${BASE_URL}/health`;
      const res = await fetch(healthUrl);
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Get paginated leads with filters
   */
  async getLeads(
    params: LeadQueryParams = {}
  ): Promise<{ data: Lead[]; pagination: ApiResponse<Lead[]>['pagination'] }> {
    const query = new URLSearchParams();

    if (params.search) query.set('search', params.search);
    if (params.status && params.status !== 'ALL') query.set('status', params.status);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${BASE_URL}/leads${queryString}`);
    const result = await handleResponse<Lead[]>(res);
    return {
      data: (result as any).data || [],
      pagination: (result as any).pagination,
    };
  },

  /**
   * Get CRM dashboard stats
   */
  async getLeadStats(): Promise<LeadStats> {
    const res = await fetch(`${BASE_URL}/leads/stats`);
    const result = await handleResponse<LeadStats>(res);
    return (result as any).data;
  },

  /**
   * Get lead by ID
   */
  async getLeadById(id: string): Promise<Lead> {
    const res = await fetch(`${BASE_URL}/leads/${id}`);
    const result = await handleResponse<Lead>(res);
    return (result as any).data;
  },

  /**
   * Create new lead
   */
  async createLead(payload: CreateLeadPayload): Promise<Lead> {
    const res = await fetch(`${BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await handleResponse<Lead>(res);
    return (result as any).data;
  },

  /**
   * Update lead status
   */
  async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    const res = await fetch(`${BASE_URL}/leads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await handleResponse<Lead>(res);
    return (result as any).data;
  },

  /**
   * Update full lead details
   */
  async updateLead(id: string, payload: UpdateLeadPayload): Promise<Lead> {
    const res = await fetch(`${BASE_URL}/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await handleResponse<Lead>(res);
    return (result as any).data;
  },

  /**
   * Delete lead
   */
  async deleteLead(id: string): Promise<{ id: string; message: string }> {
    const res = await fetch(`${BASE_URL}/leads/${id}`, {
      method: 'DELETE',
    });
    const result = await handleResponse<{ id: string; message: string }>(res);
    return (result as any).data;
  },
};
