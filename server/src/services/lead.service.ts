import { Prisma, LeadStatus } from '@prisma/client';
import { prisma } from '../prisma.js';
import { AppError } from '../middlewares/errorHandler.js';
import {
  CreateLeadInput,
  LeadQueryFilters,
  LeadStats,
  PaginatedResult,
  UpdateLeadInput,
  Lead,
} from '../types/lead.types.js';

export class LeadService {
  /**
   * Create a new lead
   */
  static async createLead(data: CreateLeadInput): Promise<Lead> {
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status || 'NEW',
        company: data.company || null,
        notes: data.notes || null,
      },
    });

    return lead;
  }

  /**
   * Get all leads with search, filtering, sorting, and pagination
   */
  static async getLeads(filters: LeadQueryFilters): Promise<PaginatedResult<Lead>> {
    const {
      search,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where: Prisma.LeadWhereInput = {};

    // Filter by status if provided and not ALL
    if (status && status !== 'ALL') {
      where.status = status as LeadStatus;
    }

    // Search across name, email, and phone
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { phone: { contains: searchTerm } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.lead.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get lead by ID
   */
  static async getLeadById(id: string): Promise<Lead> {
    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      throw new AppError('Lead not found with the provided ID', 404);
    }

    return lead;
  }

  /**
   * Update lead status
   */
  static async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    // Check if lead exists first
    const existing = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('Lead not found with the provided ID', 404);
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status },
    });

    return updatedLead;
  }

  /**
   * Update full lead details
   */
  static async updateLead(id: string, data: UpdateLeadInput): Promise<Lead> {
    const existing = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('Lead not found with the provided ID', 404);
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.company !== undefined && { company: data.company }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });

    return updatedLead;
  }

  /**
   * Delete lead
   */
  static async deleteLead(id: string): Promise<{ id: string; message: string }> {
    const existing = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('Lead not found with the provided ID', 404);
    }

    await prisma.lead.delete({
      where: { id },
    });

    return { id, message: 'Lead successfully deleted' };
  }

  /**
   * Get CRM dashboard statistics and aggregations
   */
  static async getLeadStats(): Promise<LeadStats> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [total, statusCounts, newThisWeek] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      }),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: oneWeekAgo,
          },
        },
      }),
    ]);

    const byStatus: Record<LeadStatus, number> = {
      NEW: 0,
      CONTACTED: 0,
      QUALIFIED: 0,
      PROPOSAL_SENT: 0,
      WON: 0,
      LOST: 0,
    };

    statusCounts.forEach((group) => {
      byStatus[group.status] = group._count.status;
    });

    const wonCount = byStatus.WON || 0;
    const conversionRate = total > 0 ? Number(((wonCount / total) * 100).toFixed(1)) : 0;

    return {
      total,
      byStatus,
      conversionRate,
      newThisWeek,
    };
  }
}
