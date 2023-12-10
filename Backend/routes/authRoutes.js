import express from 'express'
import { passwordReset, passwordResetRequest, signUp, signOut, userSignIn } from '../controllers/authController.js';
import { check } from 'express-validator';

const router = express.Router();

router.post(
    '/sign-up',
    [
        check('firstName').notEmpty().escape().withMessage('First name is required'),
        check('lastName').notEmpty().escape().withMessage('Last name is required'),
        check('taxId').notEmpty().withMessage('Valid TaxID is required').isLength({ min: 16, max: 16 }).withMessage('TaxID must be exactly 16 characters').isAlphanumeric().withMessage('TaxID must contain only alphanumeric characters').escape(),
        check('email').notEmpty().isEmail().escape().withMessage('Valid email is required'),
        check('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        check('profilePicture').optional().custom((value, { req }) => {
            if (!value.match(/\.(jpg|jpeg|png)$/i)) {
                throw new Error('Profile picture must be a valid JPEG or PNG image');
            }
            return true;
        }),
    ],
    signUp
);

router.post(
    '/sign-in',
    [
      check('email').notEmpty().isEmail().withMessage('Valid email is required'),
      check('password').notEmpty().withMessage('Password is required'),
    ],
    userSignIn
);

router.post('/password-reset-request', passwordResetRequest)
router.post('/password-reset/:token', passwordReset)

router.get('/sign-out', signOut)

export default router