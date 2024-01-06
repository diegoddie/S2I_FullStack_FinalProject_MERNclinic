import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import { validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode';
import cloudinary from "../utils/cloudinary.js";

export const getUserProfile = async(req,res,next) => {
    if(req.user.id !== req.params.id){
        return next(errorHandler(401, 'You can see only your account'))
    }

    const userId = req.user.id

    try{
        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({message: "user not found."})
        }

        const {password, twoFactorEnabled, twoFactorSecret, isAdmin, ...rest} = user._doc

        res.status(200).json({...rest})
    }catch(err){
        next(errorHandler(500, 'Internal Server Error'));
    }
}

export const getAllUsers = async(req,res,next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        next(errorHandler(500, 'Internal Server Error'));
    }
}

export const updateUser = async(req,res,next) => {
    // Check if the user is trying to update their own account
    if(req.user.id !== req.params.id){
        return next(errorHandler(401, 'You can update only your account'))
    }

    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Initialize an empty object to store the fields to be updated
        const updateFields = {};
        let qrCodeData;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

        if (req.body.firstName) {
            updateFields.firstName = req.body.firstName;
        }
      
        if (req.body.lastName) {
            updateFields.lastName = req.body.lastName;
        }

        if (req.body.email) {
            // Check if the new email already exists for another user
            const existingEmail = await User.findOne({ email: req.body.email, _id: { $ne: req.params.id } });
            if (existingEmail) {
              return res.status(409).json({ message: 'Email already exists' });
            }
            updateFields.email = req.body.email;
        }

        if (req.body.password) {
            if (req.body.password !== req.body.confirmPassword) {
                return res.status(400).json({ message: 'Password and Confirm Password do not match' });
            } else if (!passwordRegex.test(req.body.password)) {
                return res.status(400).json({ message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' });
            } else {
                updateFields.password = bcryptjs.hashSync(req.body.password, 10);
            }
        }
      
        if (req.body.taxId) {
            // Check if the new tax ID already exists for another user
            const existingTaxId = await User.findOne({ taxId: req.body.taxId, _id: { $ne: req.params.id } });
            if (existingTaxId) {
              return res.status(409).json({ message: 'TaxId already exists' });
            }
            updateFields.taxId = req.body.taxId;
        }

        if (req.body.phoneNumber){
            updateFields.phoneNumber = req.body.phoneNumber;
        }

        if (req.body.profilePicture) {
            updateFields.profilePicture = req.body.profilePicture;
        }

        if (req.body.twoFactorEnabled !== undefined) {
            updateFields.twoFactorEnabled = req.body.twoFactorEnabled;
      
            // If two-factor authentication is enabled, generate a temporary secret and QR code
            if (req.body.twoFactorEnabled) {
              const tempSecret = speakeasy.generateSecret({ length: 20, name: 'MyClinic' });
              updateFields.twoFactorSecret = tempSecret.base32;
              
              qrCodeData = await qrcode.toDataURL(tempSecret.otpauth_url);
            } else {
              updateFields.twoFactorSecret = undefined;
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return next(errorHandler(404, "User not found"));
        }

        const {password, ...rest} = updatedUser._doc;
        res.status(200).json({ user: rest, qrCode: qrCodeData });
    }catch(err){
        console.log(err)
        next(errorHandler(500, 'Internal Server Error'));
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can delete only your account'))
    }
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return next(errorHandler(404, 'User not found'));
        }
        res.status(200).json({ message: 'User has been deleted' });
    } catch (err) {
        next(errorHandler(500, 'Internal Server Error'));
    }
}