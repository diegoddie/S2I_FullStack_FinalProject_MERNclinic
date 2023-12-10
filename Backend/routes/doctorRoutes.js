import express from 'express';
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
  getDoctorsByLastName,
  updateDoctor,
  deleteDoctor,
  getDoctorsByCity,
} from '../controllers/doctorController.js';
import { verifyToken, verifyAdmin } from '../middleware/middleware.js';
import { check } from 'express-validator';
import { doctorSignIn } from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/sign-in',
  [
    check('email').notEmpty().isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  doctorSignIn
)

router.post(
  '/create', 
  verifyToken, 
  verifyAdmin, 
  [
    check('firstName').notEmpty().escape().withMessage('First name is required'),
    check('lastName').notEmpty().escape().withMessage('Last name is required'),
    check('email').notEmpty().isEmail().escape().withMessage('Valid email is required'),
    check('phoneNumber').notEmpty().withMessage('Phone number is required'),
    check('specialization').notEmpty().escape().withMessage('Specialization is required'),
    check('city').notEmpty().escape().withMessage('City is required'),
    check('profilePicture').optional().custom((value, { req }) => {
        if (!value.match(/\.(jpg|jpeg)$/)) {
        throw new Error('Profile picture must be a valid JPEG image');
        }
        return true;
    }),
    check('workShifts').optional().isArray().withMessage('Work shifts must be an array'),
    check('workShifts.*.dayOfWeek').notEmpty().isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]).escape().withMessage('Invalid day of the week for work shift'),
    check('workShifts.*.startTime').optional().isString().withMessage('Start time must be a string').custom((value, { req }) => {
      if (value) {
          const startTime = new Date(`1970-01-01T${value}`);
          if (startTime < new Date('1970-01-01T08:00:00')) {
              throw new Error('Start time must be after 8:00');
          }
      }
      return true;
    }),
    check('workShifts.*.endTime').optional().isString().withMessage('End time must be a string').custom((value, { req }) => {
      if (value) {
          const endTime = new Date(`1970-01-01T${value}`);
          if (endTime > new Date('1970-01-01T20:00:00')) {
              throw new Error('End time must be before 20:00');
          }
      }
      return true;
    }),
    check('nonAvailability').optional().isArray().withMessage('Non availability must be an array').custom((value, { req }) => {
      if (!Array.isArray(value)) {
          throw new Error('Non availability must be an array');
      }
  
      for (let i = 0; i < value.length; i++) {
          const startDate = new Date(value[i].startDate);
          const endDate = new Date(value[i].endDate);
  
          if (isNaN(startDate.getTime())) {
              throw new Error(`Start date is required and must be a valid date for item ${i}`);
          }
  
          if (isNaN(endDate.getTime())) {
              throw new Error(`End date is required and must be a valid date for item ${i}`);
          }
  
          if (startDate > endDate) {
              throw new Error(`End date must be equal to or after start date for item ${i}`);
          }
      }
  
      return true;
    }),
  ],
  createDoctor
);


router.put(
    '/update/:id', 
    verifyToken, 
    [
      check('firstName').optional().notEmpty().escape().withMessage('First name is required'),
      check('lastName').optional().notEmpty().escape().withMessage('Last name is required'),
      check('email').optional().isEmail().escape().withMessage('Valid email is required'),
      check('password').optional().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
      check('phoneNumber').optional().notEmpty().withMessage('Phone number is required'),
      check('specialization').optional().notEmpty().escape().withMessage('Specialization is required'),
      check('city').optional().notEmpty().escape().withMessage('City is required'),
      check('profilePicture').optional().custom((value, { req }) => {
        if (!value.match(/\.(jpg|jpeg)$/)) {
          throw new Error('Profile picture must be a valid JPEG image');
        }
        return true;
      }),
      check('workShifts').optional().isArray().withMessage('Work shifts must be an array'),
      check('workShifts.*.dayOfWeek').optional().notEmpty().isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]).escape().withMessage('Invalid day of the week for work shift'),
      check('workShifts.*.startTime').optional().isString().withMessage('Start time must be a string').custom((value, { req }) => {
        if (value) {
            const startTime = new Date(`1970-01-01T${value}`);
            if (startTime < new Date('1970-01-01T08:00:00')) {
                throw new Error('Start time must be after 8:00');
            }
        }
        return true;
      }),
      check('workShifts.*.endTime').optional().isString().withMessage('End time must be a string').custom((value, { req }) => {
        if (value) {
            const endTime = new Date(`1970-01-01T${value}`);
            if (endTime > new Date('1970-01-01T20:00:00')) {
                throw new Error('End time must be before 20:00');
            }
        }
        return true;
      }),
      check('nonAvailability').optional().isArray().withMessage('Non availability must be an array').custom((value, { req }) => {
        if (!Array.isArray(value)) {
            throw new Error('Non availability must be an array');
        }
    
        for (let i = 0; i < value.length; i++) {
            const startDate = new Date(value[i].startDate);
            const endDate = new Date(value[i].endDate);
    
            if (isNaN(startDate.getTime())) {
                throw new Error(`Start date is required and must be a valid date for item ${i}`);
            }
    
            if (isNaN(endDate.getTime())) {
                throw new Error(`End date is required and must be a valid date for item ${i}`);
            }
    
            if (startDate > endDate) {
                throw new Error(`End date must be equal to or after start date for item ${i}`);
            }
        }
    
        return true;
      }),
    ],
    updateDoctor
);

router.delete('/delete/:id', verifyToken, deleteDoctor);

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/specialization/:specialization', getDoctorsBySpecialization);
router.get('/lastname/:lastname', getDoctorsByLastName);
router.get('/city/:city', getDoctorsByCity);

export default router;
