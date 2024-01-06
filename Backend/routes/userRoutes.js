import express from 'express'
import { check } from 'express-validator';
import { updateUser, deleteUser, getAllUsers, getUserProfile } from '../controllers/userController.js';
import { verifyAdmin, verifyToken } from '../middleware/middleware.js';
const router = express.Router();

router.get('/', verifyToken, verifyAdmin, getAllUsers)
router.get('/:id', verifyToken, getUserProfile)

router.put(
    '/update/:id',
    verifyToken,
    [
        check('firstName').optional().notEmpty().escape().withMessage('First name is required'),
        check('lastName').optional().notEmpty().escape().withMessage('Last name is required'),
        check('taxId').optional().notEmpty().withMessage('Valid TaxID is required').isLength({ min: 16, max: 16 }).withMessage('TaxID must be exactly 16 characters').isAlphanumeric().withMessage('TaxID must contain only alphanumeric characters').escape(),
        check('email').optional().isEmail().escape().withMessage('Valid email is required'),
        check('password').optional().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        //check('profilePicture').optional().custom((value, { req }) => {
            //console.log('File name:', value);
            //if (!value.match(/\.(jpg|jpeg|png)$/i)) {
                //throw new Error('Profile picture must be a valid JPEG, JPG or PNG image');
            //}
            //return true;
        //}),
    ], 
    updateUser
);

router.delete('/delete/:id', verifyToken, deleteUser)

export default router