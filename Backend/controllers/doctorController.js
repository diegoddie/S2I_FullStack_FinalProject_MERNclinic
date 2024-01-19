import Doctor from "../models/doctorModel.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import { validationResult } from 'express-validator';
import { generateRandomPassword } from "../utils/auth/generateRandomPsw.js";
import Visit from "../models/visitModel.js";
import User from "../models/userModel.js";
import { sendVisitCancellationEmail } from "../utils/visits/visitCancellationEmail.js";
import speakeasy from 'speakeasy'
import { sendWelcomeEmail } from "../utils/doctors/doctorWelcomeEmail.js";

export const createDoctor = async (req, res, next) => {
  try {
      const errors = validationResult(req) 
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()}) 
      }
      const { firstName, lastName, taxId, email, specialization, city, profilePicture, about, phoneNumber, workShifts, nonAvailability } = req.body;
      console.log(profilePicture)
      // Check if a doctor with the same email already exists
      const existingTaxId = await Doctor.findOne({ taxId });
      const existingDoctor = await Doctor.findOne({ email });

      if (existingDoctor || existingTaxId) {
        return res.status(409).json({ message: "A Doctor with the same TaxId or email already exists" });
      }

      // Generate a random password for the new doctor
      const randomPassword = generateRandomPassword();
      // Hash the random password
      const hashedPassword = bcryptjs.hashSync(randomPassword, 10)
      // Generate a temporary secret for two-factor authentication
      const tempSecret = speakeasy.generateSecret({ length: 20, name: 'MyClinic' });

      const newDoctor = await Doctor.create({ firstName, lastName, email, taxId, password:hashedPassword, specialization, city, profilePicture, about, phoneNumber, twoFactorSecret: tempSecret.base32, workShifts, nonAvailability });

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

export const getDoctorProfile = async(req,res,next) => {
  if(req.user.id !== req.params.id){
      return next(errorHandler(401, 'You can see only your account'))
  }

  const userId = req.user.id

  try{
      const doctor = await Doctor.findById(userId)

      if(!doctor){
          return res.status(404).json({message: "doctor not found."})
      }

      const {password, twoFactorEnabled, twoFactorSecret, ...rest} = doctor._doc

      res.status(200).json({...rest})
  }catch(err){
      next(errorHandler(500, 'Internal Server Error'));
  }
}

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

      const { firstName, lastName, email, password, confirmPassword, taxId, specialization, about, city, workShifts, nonAvailability, phoneNumber, profilePicture } = req.body;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

      // Initialize an empty object to store the fields to be updated
      const updateFields = {};

      if (firstName) updateFields.firstName = firstName;
      if (lastName) updateFields.lastName = lastName;

      if (taxId) {
        const existingTaxId = await User.findOne({ taxId, _id: { $ne: req.params.id } });
        if (existingTaxId) return res.status(409).json({ message: 'TaxId already exists' });
        updateFields.taxId = taxId;
      }

      if (email) {
          const existingEmail = await Doctor.findOne({ email, _id: { $ne: req.params.id } });
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

      if (specialization) updateFields.specialization = specialization;
      if (about) updateFields.about = about;
      if (city) updateFields.city = city;
      if (phoneNumber) updateFields.phoneNumber = phoneNumber;
      if (profilePicture) updateFields.profilePicture = profilePicture;
      if (workShifts) updateFields.workShifts = workShifts;
      if (nonAvailability) updateFields.nonAvailability = nonAvailability;

      const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true });

      if (!updatedDoctor) {
        return next(errorHandler(404, "Doctor not found"));
      }

      const {password: userPassword, ...rest} = updatedDoctor._doc;

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

