import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { prisma } from '../prisma.js';

// Mock Prisma
vi.mock('../prisma.js', () => {
  return {
    prisma: {
      lead: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
        groupBy: vi.fn(),
      },
    },
  };
});

describe('Lead Tracker API Endpoints', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return 200 OK and health payload', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toContain('Lead Tracker');
    });
  });

  describe('POST /api/leads', () => {
    it('should create a lead with valid payload', async () => {
      const mockLead = {
        id: 'uuid-1234',
        name: 'Rohan Mehra',
        email: 'rohan.mehra@company.com',
        phone: '+91 9876543210',
        status: 'NEW',
        company: 'Mehra Logistics',
        notes: 'Needs 10 desks',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.lead.create).mockResolvedValueOnce(mockLead as any);

      const payload = {
        name: 'Rohan Mehra',
        email: 'rohan.mehra@company.com',
        phone: '+91 9876543210',
        status: 'NEW',
        company: 'Mehra Logistics',
        notes: 'Needs 10 desks',
      };

      const res = await request(app).post('/api/leads').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('uuid-1234');
      expect(res.body.data.name).toBe('Rohan Mehra');
      expect(prisma.lead.create).toHaveBeenCalledTimes(1);
    });

    it('should fail with 400 when email is invalid', async () => {
      const payload = {
        name: 'Rohan Mehra',
        email: 'not-an-email',
        phone: '+91 9876543210',
      };

      const res = await request(app).post('/api/leads').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Validation failed');
      expect(res.body.error.details.some((d: any) => d.field === 'email')).toBe(true);
    });

    it('should fail with 400 when name is too short', async () => {
      const payload = {
        name: 'A',
        email: 'valid@example.com',
        phone: '+91 9876543210',
      };

      const res = await request(app).post('/api/leads').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.details.some((d: any) => d.field === 'name')).toBe(true);
    });
  });

  describe('GET /api/leads', () => {
    it('should list leads with default pagination', async () => {
      const mockList = [
        {
          id: 'lead-1',
          name: 'Pooja Verma',
          email: 'pooja@verma.com',
          phone: '+91 9123456780',
          status: 'CONTACTED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(prisma.lead.findMany).mockResolvedValueOnce(mockList as any);
      vi.mocked(prisma.lead.count).mockResolvedValueOnce(1);

      const res = await request(app).get('/api/leads?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination.total).toBe(1);
      expect(res.body.pagination.page).toBe(1);
    });

    it('should filter leads by search term and status', async () => {
      vi.mocked(prisma.lead.findMany).mockResolvedValueOnce([]);
      vi.mocked(prisma.lead.count).mockResolvedValueOnce(0);

      const res = await request(app).get('/api/leads?search=TechCorp&status=QUALIFIED');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(prisma.lead.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'QUALIFIED',
            OR: expect.arrayContaining([
              { name: { contains: 'TechCorp', mode: 'insensitive' } },
            ]),
          }),
        })
      );
    });
  });

  describe('PATCH /api/leads/:id/status', () => {
    it('should update lead status successfully', async () => {
      const existing = {
        id: 'lead-123',
        name: 'Suresh Raina',
        email: 'suresh@cricket.in',
        phone: '+91 9988776655',
        status: 'NEW',
      };

      const updated = { ...existing, status: 'WON' };

      vi.mocked(prisma.lead.findUnique).mockResolvedValueOnce(existing as any);
      vi.mocked(prisma.lead.update).mockResolvedValueOnce(updated as any);

      const res = await request(app)
        .patch('/api/leads/lead-123/status')
        .send({ status: 'WON' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('WON');
      expect(prisma.lead.update).toHaveBeenCalledWith({
        where: { id: 'lead-123' },
        data: { status: 'WON' },
      });
    });

    it('should return 404 when lead does not exist', async () => {
      vi.mocked(prisma.lead.findUnique).mockResolvedValueOnce(null);

      const res = await request(app)
        .patch('/api/leads/unknown-id/status')
        .send({ status: 'QUALIFIED' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('Lead not found');
    });

    it('should reject invalid status with 400', async () => {
      const res = await request(app)
        .patch('/api/leads/lead-123/status')
        .send({ status: 'INVALID_STATUS' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/leads/stats', () => {
    it('should return CRM dashboard statistics', async () => {
      vi.mocked(prisma.lead.count)
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(3); // newThisWeek

      vi.mocked(prisma.lead.groupBy).mockResolvedValueOnce([
        { status: 'WON', _count: { status: 3 } },
        { status: 'NEW', _count: { status: 4 } },
        { status: 'CONTACTED', _count: { status: 2 } },
        { status: 'LOST', _count: { status: 1 } },
      ] as any);

      const res = await request(app).get('/api/leads/stats');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(10);
      expect(res.body.data.byStatus.WON).toBe(3);
      expect(res.body.data.conversionRate).toBe(30);
      expect(res.body.data.newThisWeek).toBe(3);
    });
  });
});
