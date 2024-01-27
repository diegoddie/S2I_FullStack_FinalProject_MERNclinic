import express from 'express';
import { createDoctor, getAllDoctors, getDoctorById, getDoctorsBySpecialization, getDoctorsByLastName, updateDoctor, deleteDoctor, getDoctorsByCity, getDoctorProfile, deleteLeaveRequest, approveLeaveRequest, declineLeaveRequest } from '../controllers/doctorController.js';
import { disable2FA, doctorSignIn, generate2FA, passwordReset, passwordResetRequest, verify2FA, verifyPassword } from '../controllers/authController.js';
import { verifyToken, verifyAdmin, cloudinaryMiddleware } from '../middleware/middleware.js';
import { check } from 'express-validator';
import Doctor from '../models/doctorModel.js';

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
  cloudinaryMiddleware,
  [
    check('firstName').notEmpty().escape().withMessage('First name is required'),
    check('lastName').notEmpty().escape().withMessage('Last name is required'),
    check('taxId').notEmpty().withMessage('Valid TaxID is required').isLength({ min: 16, max: 16 }).withMessage('TaxID must be exactly 16 characters').isAlphanumeric().withMessage('TaxID must contain only alphanumeric characters').escape(),
    check('email').notEmpty().isEmail().escape().withMessage('Valid email is required'),
    check('phoneNumber').notEmpty().withMessage('Phone number is required'),
    check('specialization').notEmpty().escape().withMessage('Specialization is required'),
    check('city').notEmpty().escape().withMessage('City is required'),
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
  createDoctor
);

router.post('/verify-password', verifyToken, (req, res, next) => verifyPassword(req, res, next, Doctor))

router.put(
    '/update/:id', 
    verifyToken,
    cloudinaryMiddleware,
    [
      check('taxId').optional().notEmpty().withMessage('Valid TaxID is required').isLength({ min: 16, max: 16 }).withMessage('TaxID must be exactly 16 characters').isAlphanumeric().withMessage('TaxID must contain only alphanumeric characters').escape(),
      check('email').optional().isEmail().escape().withMessage('Valid email is required'),
      check('password').optional().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
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
            if (endTime > new Date('1970-01-01T19:00:00')) {
                throw new Error('End time must be before 19:00');
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

router.put('/:id/approve/:leaveRequestId', verifyToken, verifyAdmin, approveLeaveRequest);
router.put('/:id/decline/:leaveRequestId', verifyToken, verifyAdmin, declineLeaveRequest);

router.post('/password-reset-request', (req, res, next) => passwordResetRequest(req, res, next, Doctor));
router.post('/password-reset/:token', (req, res, next) => passwordReset(req, res, next, Doctor));

router.post('/generate2FA/:id', verifyToken, (req, res, next) => generate2FA(req, res, next, Doctor));

router.post('/verify2FA/:id', verifyToken, [
    check('userId').notEmpty().withMessage('Doctor ID is required'),
    check('tempSecretCode').notEmpty().withMessage('Temporary secret code is required'),
], (req, res, next) => verify2FA(req, res, next, Doctor));

router.post('/disable2FA/:id', verifyToken, [
    check('password').notEmpty().withMessage('Password is required for 2FA disable verification'),
    check('confirmPassword').notEmpty().withMessage('Confirm password is required for 2FA disable verification'),
], (req, res, next) => disable2FA(req, res, next, Doctor));

router.delete('/delete/:id', verifyToken, deleteDoctor);
router.delete('/:id/leave-requests/:leaveRequestId', verifyToken, deleteLeaveRequest);

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/profile/:id', verifyToken, getDoctorProfile);
router.get('/specialization/:specialization', getDoctorsBySpecialization);
router.get('/lastname/:lastname', getDoctorsByLastName);
router.get('/city/:city', getDoctorsByCity);

export default router;
