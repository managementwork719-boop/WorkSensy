import express from 'express';
import { setupNewCompany, getAllCompanies } from '../controllers/superAdminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only Super Admins can access these routes
router.use(protect);
router.use(restrictTo('super-admin'));

router.post('/setup-company', setupNewCompany);
router.get('/companies', getAllCompanies);

export default router;
