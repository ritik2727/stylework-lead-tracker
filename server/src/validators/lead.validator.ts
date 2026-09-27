import { z } from 'zod';

const leadStatusEnum = z.enum([
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL_SENT',
  'WON',
  'LOST',
]);

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

export const createLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .max(150, 'Email cannot exceed 150 characters')
    .toLowerCase(),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Please provide a valid phone number (min 7 digits)'),
  status: leadStatusEnum.default('NEW'),
  company: z.string().trim().max(100, 'Company cannot exceed 100 characters').optional().nullable(),
  notes: z.string().trim().max(1000, 'Notes cannot exceed 1000 characters').optional().nullable(),
});

export const updateLeadStatusSchema = z.object({
  status: leadStatusEnum,
});

export const updateLeadSchema = createLeadSchema.partial();

export const queryLeadsSchema = z.object({
  search: z.string().trim().optional(),
  status: z.union([leadStatusEnum, z.literal('ALL')]).optional().default('ALL'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum(['name', 'email', 'status', 'createdAt', 'updatedAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateLeadSchemaType = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusSchemaType = z.infer<typeof updateLeadStatusSchema>;
export type UpdateLeadSchemaType = z.infer<typeof updateLeadSchema>;
export type QueryLeadsSchemaType = z.infer<typeof queryLeadsSchema>;
