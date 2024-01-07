import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'
import { generateResetToken } from "../utils/passwordReset/generateResetToken.js";
import { sendResetPasswordEmail } from "../utils/passwordReset/sendResetPswEmail.js";
import Doctor from "../models/doctorModel.js";
import speakeasy from 'speakeasy'
import verifyOTP from "../utils/verifyOTP.js";

export const signUp = async(req,res,next) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()}) 
        }
        const { firstName, lastName, email, taxId, password, confirmPassword, phoneNumber, profilePicture, isAdmin } = req.body;

        if (password !== confirmPassword) {
          return res.status(400).json({ message: "Passwords do not match" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one lowercase letter, one uppercase letter, and one number" });
        }

        // Check for existing user with the same TaxID or email
        const existingTaxId = await User.findOne({ taxId });
        const existingUser = await User.findOne({ email });

        if (existingUser || existingTaxId) {
            return res.status(409).json({ message: "User with the same TaxID or email already exists" });
        }

        // Hash the password and generate a temporary two-factor authentication secret
        const hashedPassword = bcryptjs.hashSync(password, 10)
        //const tempSecret = speakeasy.generateSecret({ length: 20, name: 'MyClinic' });
        
        const newUser = await User.create({firstName, lastName, email, taxId, password: hashedPassword, phoneNumber, profilePicture, isAdmin})

        res.status(201).json({ message: "User created successfully", user: newUser });
    }catch(err){
        console.log(err)
        next(errorHandler(500, 'Internal Server Error'));
    }
}

export const userSignIn = async (req, res, next) => {
    const { email, password, twoFactorCode } = req.body;
  
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const validUser = await User.findOne({ email });
      if (!validUser) {
        return next(errorHandler(404, 'User not found'));
      }
  
      // Compare the provided password with the stored hashed password
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
        return res.status(401).json({message:'Wrong credentials. Please check your email and password.'}) 
      }

      // Verify two-factor authentication code if enabled
      if (validUser.twoFactorEnabled) {
        if (!twoFactorCode) {
          return res.status(200).json({ codeRequested: true });
        }
        
        const isValidOTP = verifyOTP(validUser, twoFactorCode)
      
        if (!isValidOTP) {
          return next(errorHandler(401, 'Invalid two-factor authentication code.'));
        }
      } else if (twoFactorCode) {
        return next(errorHandler(400, 'Two-factor authentication is not enabled for this user.'));
      }
      
      // Generate JWT token for authentication
      const tokenPayload = { 
        id: validUser._id 
      };
  
      if (validUser.isAdmin) {
        tokenPayload.role = 'admin';
      }
  
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = validUser._doc;
      const expiryDate = new Date(Date.now() + 3000000);
  
      // Set the token as an HTTP-only cookie and respond with user details
      res
        .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json({ user: rest, token: token, expiration: expiryDate.getTime()});
    } catch (err) {
        next(errorHandler(500, 'Internal Server Error'));
    }
};

export const doctorSignIn = async (req, res, next) => {
  const { email, password, twoFactorCode } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const validDoctor = await Doctor.findOne({ email });
    if (!validDoctor) {
      return next(errorHandler(404, 'Doctor not found'));
    }

    // Compare the provided password with the stored hashed password
    const validPassword = bcryptjs.compareSync(password, validDoctor.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Wrong credentials. Please check your email and password.'));
    }

    // Verify two-factor authentication code if enabled
    if (validDoctor.twoFactorEnabled) {
      if (!twoFactorCode) {
        return next(errorHandler(400, 'Two-factor authentication code is required.'));
      }
      
      const isValidOTP = speakeasy.totp.verify({
        secret: validDoctor.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
      });
    
      if (!isValidOTP) {
        return next(errorHandler(401, 'Invalid two-factor authentication code.'));
      }
    } else if (twoFactorCode) {
      return next(errorHandler(400, 'Two-factor authentication is not enabled for this user.'));
    }

    // Generate JWT token for authentication
    const tokenPayload = { id: validDoctor._id };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validDoctor._doc;
    const expiryDate = new Date(Date.now() + 3600000);

    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (err) {
      next(errorHandler(500, 'Internal Server Error'));
  }
};

export const signOut = async (req, res) => {
  try {
    // Extract the access token cookie from the request
    const accessTokenCookie = req.cookies["access_token"];

    // If the cookie is not present, return unauthorized status
    if (!accessTokenCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Decode the token to get the user ID
    const decodedToken = jwt.verify(accessTokenCookie, process.env.JWT_SECRET);

    // If the user ID is not present, return unauthorized status
    if (!decodedToken.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.clearCookie('access_token').status(200).json({ message: 'Signout success for user ID: ' + decodedToken.id });
  } catch (error) {
    console.log(error)
    errorHandler(500, 'Internal Server Error');
  }
};

export const passwordResetRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token and send the reset password email
    const resetToken = generateResetToken(user);
    console.log(`Reset token: ${resetToken}`)

    await sendResetPasswordEmail(user.email, resetToken);

    res.status(200).json({ message: 'Password reset email sent successfully', resetToken });
  } catch (err) {
    console.log(err)
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const passwordReset = async (req, res, next) => {
  try {
    // Extract token and new password from request parameters and body
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: "Password must contain at least one lowercase letter, one uppercase letter, and one number" });
    }

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Verify the reset token
    const decodedToken = jwt.verify(token, process.env.RESET_SECRET);

    // Find the user from the token
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password and save it to the user
    user.password = bcryptjs.hashSync(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token expired' });
    }

    next(errorHandler(500, 'Internal Server Error'));
  }
};