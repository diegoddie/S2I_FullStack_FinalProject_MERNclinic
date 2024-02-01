import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'
import { generateResetToken } from "../utils/passwordReset/generateResetToken.js";
import { sendResetPasswordEmail } from "../utils/passwordReset/sendResetPswEmail.js";
import Doctor from "../models/doctorModel.js";
import verifyOTP from "../utils/auth/verifyOTP.js";
import generateTokenPayload from "../utils/auth/generateTokenPayload.js";
import speakeasy from 'speakeasy'

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

        const existingTaxId = await User.findOne({ taxId });
        const existingUser = await User.findOne({ email });

        if (existingUser || existingTaxId) {
            return res.status(409).json({ message: "User with the same TaxID or email already exists" });
        }

        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newUser = await User.create({firstName, lastName, email, taxId, password: hashedPassword, phoneNumber, profilePicture, isAdmin})

        res.status(201).json({ message: "User created successfully", user: newUser });
    }catch(err){
        console.log(err)
        next(errorHandler(500, 'Internal Server Error'));
    }
}

const signIn = async (req, res, next, Model) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, twoFactorCode } = req.body;
      const validUser = await Model.findOne({ email });

      if (!validUser) {
          return res.status(404).json({message: `${Model.modelName} not found`});
      }

      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
          return res.status(401).json({ message: 'Wrong credentials. Please check your email and password.' });
      }

      if (validUser.twoFactorEnabled) {
          if (!twoFactorCode) {
              return res.status(200).json({ codeRequested: true });
          }

          const isValidOTP = verifyOTP(validUser, twoFactorCode);

          if (!isValidOTP) {
              return res.status(401).json({message: 'Invalid two-factor authentication code.'})
          }
      } else if (twoFactorCode) {
          return res.status(400).json({message: 'Two-factor authentication is not enabled for this user.'})
      }

      // Generate JWT token for authentication
      const tokenPayload = generateTokenPayload(validUser, validUser.isAdmin ? 'admin' : undefined);

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = validUser._doc;
      const expiryDate = new Date(Date.now() + (validUser.isAdmin ? 43200000 : 3600000));

      res
          .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
          .status(200)
          .json({ user: rest, token, expiration: expiryDate.getTime() });
  } catch (err) {
      next(errorHandler(500, 'Internal Server Error'));
      console.log(err)
  }
};

export const userSignIn = async (req, res, next) => {
  await signIn(req, res, next, User);
};

export const doctorSignIn = async (req, res, next) => {
  await signIn(req, res, next, Doctor);
};

export const verifyPassword = async(req,res,next,Model)=>{
  try{
      const { password } = req.body;

      if (!password) {
          return res.status(400).json({ message: 'Password is required' });
      }
  
      const validUser = await Model.findById(req.user.id);

      if (!validUser) {
          return res.status(404).json({message: 'not found'});
      }
  
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
          return res.status(401).json({ message: 'Wrong credentials. Please check your password.' });
      }

      return res.status(200).json({ message: 'Correct Password' });
  }catch(error){
      console.error(error);
      next(errorHandler(500, 'Internal Server Error'));
  }
}

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

export const passwordResetRequest = async (req, res, next, Model) => {
  try {
    const { email } = req.body;
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: `${Model.modelName} not found` });
    }

    // Generate a reset token and send the reset password email
    const resetToken = generateResetToken(user);
    console.log(`Reset token: ${resetToken}`)

    await sendResetPasswordEmail(user.email, resetToken, Model);

    res.status(200).json({ message: 'Password reset email sent successfully', resetToken });
  } catch (err) {
    console.log(err)
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const passwordReset = async (req, res, next, Model) => {
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
    const user = await Model.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: `${Model.modelName} not found` });
    }

    // Hash the new password and save it to the user
    user.password = bcryptjs.hashSync(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token expired' });
    }
    console.log(err)
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const generate2FA = async (req, res, next, Model) => {
  if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can generate 2FA only for your own account'));
  }
  try {
      const user = await Model.findById(req.params.id);

      if (!user) {
          return next(errorHandler(404, `${Model.modelName} not found`));
      }

      if (user.twoFactorEnabled) {
          return res.status(400).json({ message: 'Two-factor authentication is already enabled for this user.' });
      }

      const tempSecret = speakeasy.generateSecret({ length: 20, name: 'MyClinic' });

      await Model.findByIdAndUpdate(req.params.id, { twoFactorSecret: tempSecret.base32 });

      res.status(200).json({ tempSecret: tempSecret.base32 });
  } catch (err) {
      console.error(err);
      next(errorHandler(500, 'Internal Server Error'));
  }
};

export const verify2FA = async (req, res, next, Model) => {
  if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can verify 2FA only for your own account'));
  }
  try {
      const { tempSecretCode } = req.body;

      if (!tempSecretCode) {
          return res.status(400).json({ message: 'Temporary secret code is required.' });
      }

      const user = await Model.findById(req.params.id);

      if (!user) {
          return next(errorHandler(404, `${Model.modelName} not found`));
      }

      const isValidTempCode = verifyOTP(user, tempSecretCode)

      if (!isValidTempCode) {
          return res.status(401).json({ message: 'Invalid temporary secret code.' });
      }

      await Model.findByIdAndUpdate(req.params.id, { twoFactorEnabled: true });

      res.status(200).json({ message: 'Two-factor authentication verified successfully.' });
  } catch (err) {
      console.error(err);
      next(errorHandler(500, 'Internal Server Error'));
  }
};

export const disable2FA = async (req, res, next, Model) => {
  if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can disable 2FA only for your own account'));
  }

  try {
      const { password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match.' });
      }

      const user = await Model.findById(req.params.id);

      if (!user) {
          return next(errorHandler(404, `${Model.modelName} not found`));
      }

      if (!user.twoFactorEnabled) {
          return res.status(400).json({ message: 'Two-factor authentication is not enabled for this user.' });
      }

      const validPassword = bcryptjs.compareSync(password, user.password);
      if (!validPassword) {
          return res.status(401).json({ message: 'Invalid password for 2FA disable verification.' });
      }

      await Model.findByIdAndUpdate(req.params.id, { twoFactorEnabled: false, twoFactorSecret: "" });

      res.status(200).json({ message: 'Two-factor authentication disabled successfully.' });
  } catch (err) {
      console.error(err);
      next(errorHandler(500, 'Internal Server Error'));
  }
};