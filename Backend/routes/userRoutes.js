import express from 'express'
import { check } from 'express-validator';
import { updateUser, deleteUser, getAllUsers, getUserProfile, generate2FA, verify2FA, disable2FA } from '../controllers/userController.js';
import { cloudinaryMiddleware, verifyAdmin, verifyToken } from '../middleware/middleware.js';
const router = express.Router();

router.get('/', verifyToken, verifyAdmin, getAllUsers)
router.get('/:id', verifyToken, getUserProfile)

router.post('/generate2FA/:id', verifyToken, generate2FA);
router.post('/verify2FA/:id', verifyToken, [
    check('userId').notEmpty().withMessage('User ID is required'),
    check('tempSecretCode').notEmpty().withMessage('Temporary secret code is required'),
], verify2FA);
router.post('/disable2FA/:id', verifyToken, [
    check('password').notEmpty().withMessage('Password is required for 2FA disable verification'),
    check('confirmPassword').notEmpty().withMessage('Confirm password is required for 2FA disable verification'),
], disable2FA);

router.put(
    '/update/:id',
    verifyToken,
    cloudinaryMiddleware,
    [
        check('firstName').optional().notEmpty().escape().withMessage('First name is required'),
        check('lastName').optional().notEmpty().escape().withMessage('Last name is required'),
        check('taxId').optional().notEmpty().withMessage('Valid TaxID is required').isLength({ min: 16, max: 16 }).withMessage('TaxID must be exactly 16 characters').isAlphanumeric().withMessage('TaxID must contain only alphanumeric characters').escape(),
        check('email').optional().isEmail().escape().withMessage('Valid email is required'),
        check('password').optional().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ], 
    updateUser
);

router.delete('/delete/:id', verifyToken, deleteUser)

export default router