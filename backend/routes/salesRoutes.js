import express from 'express';
import multer from 'multer';
import { 
  importLeads, 
  getSalesDashboard, 
  getMonthlyOverview,
  getMyLeads,
  updateLead,
  createLead,
  getTeamStats,
  getMemberLeads,
  addLeadNote,
  addLeadPayment,
  deleteLead
} from '../controllers/salesController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer config for buffer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(protect);

router.get('/dashboard', getSalesDashboard);
router.get('/my-leads', getMyLeads);
router.get('/member-leads/:name', restrictTo('admin', 'sales-manager', 'super-admin'), getMemberLeads);
router.get('/monthly-overview', getMonthlyOverview);
router.get('/team-stats', restrictTo('admin', 'sales-manager', 'super-admin'), getTeamStats);
router.patch('/lead/:id', restrictTo('admin', 'sales-team', 'sales-manager', 'super-admin'), updateLead);
router.post('/create-manual', restrictTo('admin', 'sales-team', 'sales-manager', 'super-admin'), createLead);
router.post('/import', restrictTo('admin', 'sales-team', 'sales-manager', 'super-admin'), upload.single('file'), importLeads);
router.post('/lead/:id/note', restrictTo('admin', 'sales-team', 'sales-manager', 'super-admin'), addLeadNote);
router.post('/lead/:id/payment', restrictTo('admin', 'sales-team', 'sales-manager', 'super-admin'), addLeadPayment);
router.delete('/lead/:id', restrictTo('admin', 'sales-manager', 'super-admin'), deleteLead);

export default router;
