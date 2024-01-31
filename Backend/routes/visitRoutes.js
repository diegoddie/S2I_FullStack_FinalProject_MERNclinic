import express from 'express';
import {
  createVisit,
  getAllVisits,
  getVisitById,
  getVisitsByDoctorId,
  getVisitsByUserId,
  updateVisit,
  deleteVisit,
} from '../controllers/visitController.js';
import { verifyToken, verifyAdmin } from '../middleware/middleware.js';
import { check } from 'express-validator';

const router = express.Router();

router.post(
    '/create', 
    verifyToken, 
    [
      check('user').notEmpty().isMongoId().withMessage('Invalid user ID format'),
      check('doctor').notEmpty().isMongoId().withMessage('Invalid doctor ID format'),
      check('date').notEmpty().withMessage('Date is required'),
    ],
    createVisit
);

router.get('/', verifyToken, verifyAdmin, getAllVisits);
router.get('/:id', verifyToken, getVisitById);
router.get('/doctor/:doctorId', verifyToken, verifyAdmin, getVisitsByDoctorId);
router.get('/user/:userId', verifyToken, getVisitsByUserId);

router.put(
    '/update/:id', 
    verifyToken, 
    [
      check('paid').optional().isBoolean().withMessage('Paid must be a boolean value'),
      check('cost').optional().isNumeric().toFloat().withMessage('Cost must be a valid number'),
    ],
    updateVisit
);

router.delete('/delete/:id', verifyToken, deleteVisit);

export default router;