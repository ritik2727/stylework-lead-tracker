import { Request, Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service.js';
import {
  CreateLeadSchemaType,
  QueryLeadsSchemaType,
  UpdateLeadSchemaType,
  UpdateLeadStatusSchemaType,
} from '../validators/lead.validator.js';

export class LeadController {
  /**
   * POST /api/leads - Create a new lead
   */
  static async createLead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body as CreateLeadSchemaType;
      const lead = await LeadService.createLead(body);
      res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/leads - List leads with search, filtering, pagination
   */
  static async getLeads(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = req.query as unknown as QueryLeadsSchemaType;
      const result = await LeadService.getLeads(query);
      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/leads/stats - Aggregated CRM metrics
   */
  static async getLeadStats(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await LeadService.getLeadStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/leads/:id - Get single lead by ID
   */
  static async getLeadById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const lead = await LeadService.getLeadById(id);
      res.status(200).json({
        success: true,
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/leads/:id/status - Update lead status
   */
  static async updateLeadStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.body as UpdateLeadStatusSchemaType;
      const updatedLead = await LeadService.updateLeadStatus(id, status);
      res.status(200).json({
        success: true,
        message: 'Lead status updated successfully',
        data: updatedLead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/leads/:id - Update full lead details
   */
  static async updateLead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const body = req.body as UpdateLeadSchemaType;
      const updatedLead = await LeadService.updateLead(id, body);
      res.status(200).json({
        success: true,
        message: 'Lead updated successfully',
        data: updatedLead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/leads/:id - Delete lead
   */
  static async deleteLead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await LeadService.deleteLead(id);
      res.status(200).json({
        success: true,
        message: result.message,
        data: { id: result.id },
      });
    } catch (error) {
      next(error);
    }
  }
}
