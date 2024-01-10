import Doctor from "../models/doctorModel.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import { validationResult } from 'express-validator';
import { generateRandomPassword } from "../utils/auth/generateRandomPsw.js";
import Visit from "../models/visitModel.js";
import User from "../models/userModel.js";
import { sendVisitCancellationEmail } from "../utils/visits/visitCancellationEmail.js";
import speakeasy from 'speakeasy'
import qrcode from 'qrcode';
import { sendWelcomeEmail } from "../utils/doctors/doctorWelcomeEmail.js";

export const createDoctor = async (req, res, next) => {
  try {
      const errors = validationResult(req) 
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()}) 
      }
      const { firstName, lastName, email, specialization, city, profilePicture, about, phoneNumber, workShifts, nonAvailability } = req.body;

      // Check if a doctor with the same email already exists
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(409).json({ message: "A Doctor with the same email already exists" });
      }

      // Generate a random password for the new doctor
      const randomPassword = generateRandomPassword();
      // Hash the random password
      const hashedPassword = bcryptjs.hashSync(randomPassword, 10)
      // Generate a temporary secret for two-factor authentication
      const tempSecret = speakeasy.generateSecret({ length: 20, name: 'MyClinic' });

      const newDoctor = await Doctor.create({ firstName, lastName, email, password:hashedPassword, specialization, city, profilePicture, about, phoneNumber, twoFactorSecret: tempSecret.base32, workShifts, nonAvailability });

      // Send a welcome email to the new doctor
      await sendWelcomeEmail(newDoctor.email, randomPassword);
      
      res.status(201).json({ message: "Doctor created successfully and email sent", doctor: newDoctor });
  } catch (err) {
      console.error(err);
      next(errorHandler(500, 'Internal Server Error'));
  }
};

export const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return next(errorHandler(404, "Doctor not found"));
    }
    res.status(200).json(doctor);
  } catch (err) {
    console.log(err)
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const getDoctorsBySpecialization = async (req, res, next) => {
  try {
    const specialization = req.params.specialization;

    if (!specialization) {
      return next(errorHandler(400, "Specialization parameter is required"));
    }

    const doctors = await Doctor.find({ specialization: { $regex: new RegExp(specialization, 'i') } });

    res.status(200).json(doctors);
  } catch (err) {
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const getDoctorsByLastName = async (req, res, next) => {
  try {
    const lastName = req.params.lastname;

    if (!lastName) {
      return next(errorHandler(400, "LastName parameter is required"));
    }

    const doctors = await Doctor.find({ lastName: { $regex: new RegExp(lastName, 'i') } });

    res.status(200).json(doctors);
  } catch (err) {
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const getDoctorsByCity = async (req, res, next) => {
  try {
    const city = req.params.city;

    if (!city) {
      return next(errorHandler(400, "City parameter is required"));
    }

    const doctors = await Doctor.find({ city: { $regex: new RegExp(city, 'i') } });

    res.status(200).json(doctors);
  } catch (err) {
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const updateDoctor = async (req, res, next) => {
    if(req.user.id !== req.params.id){
      return next(errorHandler(401, 'You can update only your account'))
    }

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      // Initialize an empty object to store the fields to be updated
      const updateFields = {};
      let qrCodeData;

      if (req.body.firstName) {
        updateFields.firstName = req.body.firstName;
      }
  
      if (req.body.lastName) {
        updateFields.lastName = req.body.lastName;
      }

      if(req.body.email) {
        // Check if the new email already exists for another doctor
        const existingEmail = await Doctor.findOne({ email: req.body.email, _id: { $ne: req.params.id } });
        if (existingEmail) {
          return res.status(409).json({ message: "Email already exists" });
        }
        updateFields.email = req.body.email;
      }

      if(req.body.password){
        updateFields.password = bcryptjs.hashSync(req.body.password, 10);
      }

      if (req.body.specialization) {
        updateFields.specialization = req.body.specialization;
      }

      if (req.body.about){
        updateFields.about = req.body.about;
      }

      if (req.body.city) {
        updateFields.city = req.body.city;
      }

      if (req.body.profilePicture) {
        updateFields.profilePicture = req.body.profilePicture;
      }

      if (req.body.phoneNumber) {
        updateFields.phoneNumber = req.body.phoneNumber;
      }

      if (req.body.workShifts){
        updateFields.workShifts = req.body.workShifts
      }

      if (req.body.nonAvailability){
        updateFields.nonAvailability = req.body.nonAvailability;
      }

      if (req.body.twoFactorEnabled !== undefined) {
        updateFields.twoFactorEnabled = req.body.twoFactorEnabled;
        
        // If two-factor authentication is enabled, generate a new temporary secret
        if (req.body.twoFactorEnabled) {
          const tempSecret = speakeasy.generateSecret({ length: 20, name: 'MyClinic' });
          updateFields.twoFactorSecret = tempSecret.base32;
          
          // Generate a QR code for the new two-factor authentication setup
          qrCodeData = await qrcode.toDataURL(tempSecret.otpauth_url);
        } else {
          updateFields.twoFactorSecret = undefined;
        }
      }

      const updatedDoctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },    
        { new: true }
      );

      if (!updatedDoctor) {
        return next(errorHandler(404, "Doctor not found"));
      }

      const {password, ...rest} = updatedDoctor._doc;

      res.status(200).json({ user: rest, qrCode: qrCodeData });
    } catch (err) {
      next(errorHandler(500, 'Internal Server Error'));
    }
};

export const deleteDoctor = async (req, res, next) => {
  try {
      const { id: doctorId } = req.params;
      const { id: authUserId, role } = req.user;

      const doctorToDelete = await Doctor.findById(doctorId);

      if (!doctorToDelete) {
          return next(errorHandler(404, "Doctor not found"));
      }

      if (authUserId !== doctorToDelete.id && role !== 'admin') {
          return next(errorHandler(403, 'Permission denied. You can only delete your own profile or an admin can delete any profile.'));
      }

      const currentDate = new Date();

      const futureVisits = await Visit.find({
          doctor: doctorId,
          date: { $gte: currentDate },
      });

      const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);

      // If the doctor is deleted, cancel associated future appointments
      if (deletedDoctor) {
          // Delete future appointments
          const deletionResult = await Visit.deleteMany({
              doctor: doctorId,
              date: { $gte: currentDate },
          });

          // If any appointments are deleted, send cancellation emails to the affected patients
          if (deletionResult.deletedCount > 0) {
              for (const deletedVisit of futureVisits) {
                  const patientDetails = await User.findById(deletedVisit.user);
                  const userEmail = patientDetails.email;

                  // Send visit cancellation email
                  await sendVisitCancellationEmail(userEmail, deletedDoctor.email, {
                      date: deletedVisit.date,
                      doctor: {
                          firstName: deletedDoctor.firstName,
                          lastName: deletedDoctor.lastName,
                          specialization: deletedDoctor.specialization,
                      },
                      patient: {
                          firstName: patientDetails.firstName,
                          lastName: patientDetails.lastName,
                          taxId: patientDetails.taxId,
                      },
                  });
              }
          }

          res.status(200).json({ message: "Doctor and future appointments deleted successfully" });
      } else {
          return next(errorHandler(404, "Doctor not found"));
      }
  } catch (err) {
      console.log(err);
      next(errorHandler(500, 'Internal Server Error'));
  }
};

