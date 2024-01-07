import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import { validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode';
import verifyOTP from "../utils/verifyOTP.js";

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

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return next(errorHandler(404, "User not found"));
        }

        const {password, ...rest} = updatedUser._doc;
        res.status(200).json({ user: rest });
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

export const generate2FA = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can generate 2FA only for your own account'));
    }
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        if (user.twoFactorEnabled) {
            return res.status(400).json({ message: 'Two-factor authentication is already enabled for this user.' });
        }

        const tempSecret = speakeasy.generateSecret({ length: 20, name: 'MyClinic' });

        await User.findByIdAndUpdate(req.params.id, { twoFactorSecret: tempSecret.base32 });

        res.status(200).json({ tempSecret: tempSecret.base32 });
    } catch (err) {
        console.error(err);
        next(errorHandler(500, 'Internal Server Error'));
    }
};

export const verify2FA = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can verify 2FA only for your own account'));
    }
    try {
        const { tempSecretCode } = req.body;

        if (!tempSecretCode) {
            return res.status(400).json({ message: 'Temporary secret code is required.' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const isValidTempCode = verifyOTP(user, tempSecretCode)

        if (!isValidTempCode) {
            return res.status(401).json({ message: 'Invalid temporary secret code.' });
        }

        await User.findByIdAndUpdate(req.params.id, { twoFactorEnabled: true });

        res.status(200).json({ message: 'Two-factor authentication verified successfully.' });
    } catch (err) {
        console.error(err);
        next(errorHandler(500, 'Internal Server Error'));
    }
};

export const disable2FA = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can disable 2FA only for your own account'));
    }

    try {
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({ message: 'Both password and confirmPassword are required for 2FA disable verification.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Password and confirmPassword must match.' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        if (!user.twoFactorEnabled) {
            return res.status(400).json({ message: 'Two-factor authentication is not enabled for this user.' });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password for 2FA disable verification.' });
        }

        await User.findByIdAndUpdate(req.params.id, { twoFactorEnabled: false, twoFactorSecret: "" });

        res.status(200).json({ message: 'Two-factor authentication disabled successfully.' });
    } catch (err) {
        console.error(err);
        next(errorHandler(500, 'Internal Server Error'));
    }
};