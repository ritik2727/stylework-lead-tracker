import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller.js';
import {
  validateBody,
  validateQuery,
} from '../middlewares/validateRequest.js';
import {
  createLeadSchema,
  queryLeadsSchema,
  updateLeadSchema,
  updateLeadStatusSchema,
} from '../validators/lead.validator.js';

const router = Router();

// Stats route must be placed before /:id route to prevent collision
router.get('/stats', LeadController.getLeadStats);

// Lead CRUD routes
router.post('/', validateBody(createLeadSchema), LeadController.createLead);
router.get('/', validateQuery(queryLeadsSchema), LeadController.getLeads);
router.get('/:id', LeadController.getLeadById);
router.patch(
  '/:id/status',
  validateBody(updateLeadStatusSchema),
  LeadController.updateLeadStatus
);
router.put(
  '/:id',
  validateBody(updateLeadSchema),
  LeadController.updateLead
);
router.delete('/:id', LeadController.deleteLead);

export default router;
