import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import { validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs'

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

        const {password, ...rest} = user._doc

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
    if(req.user.id !== req.params.id){
        return next(errorHandler(401, 'You can update only your account'))
    }

    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, password, confirmPassword, taxId, phoneNumber, profilePicture } = req.body;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

        const updateFields = {};
        
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;

        if (taxId) {
            const existingTaxId = await User.findOne({ taxId, _id: { $ne: req.params.id } });
            if (existingTaxId) return res.status(409).json({ message: 'TaxId already exists' });
            updateFields.taxId = taxId;
        }

        if (email) {
            const existingEmail = await User.findOne({ email, _id: { $ne: req.params.id } });
            if (existingEmail) return res.status(409).json({ message: 'Email already exists' });
            updateFields.email = email;
        }

        if (password) {
            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Password and Confirm Password do not match' });
            } else if (!passwordRegex.test(password)) {
                return res.status(400).json({ message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' });
            } else {
                updateFields.password = bcryptjs.hashSync(password, 10);
            }
        }
      
        if (phoneNumber) updateFields.phoneNumber = phoneNumber;
        if (profilePicture) updateFields.profilePicture = profilePicture;

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true });

        if (!updatedUser) {
            return next(errorHandler(404, "User not found"));
        }

        const { password: userPassword, ...rest } = updatedUser._doc;
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