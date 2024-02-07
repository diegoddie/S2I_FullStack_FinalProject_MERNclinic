import Visit from "../models/visitModel.js";
import { errorHandler } from "../utils/error.js";
import { validationResult } from 'express-validator';
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import { sendVisitConfirmationEmail } from "../utils/visits/visitConfirmationEmail.js";
import { sendVisitCancellationEmail } from "../utils/visits/visitCancellationEmail.js";

export const createVisit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.id !== req.body.user && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to create visits for other users" });
    }

    const { user, doctor, date } = req.body;
    if (!user || !doctor) {
      return res.status(400).json({ message: "Doctor and user are required" });
    }
    const visitDate = new Date(date);
    const currentDate = new Date();

    if (visitDate <= currentDate) {
      return res.status(400).json({ message: "Visit date must be in the future" });
    }

    const doctorDetails = await Doctor.findById(doctor);
    const patientDetails = await User.findById(user);

    if (!doctorDetails || !patientDetails) {
      return res.status(404).json({ message: "Doctor or patient not found" });
    }

    const startTime = visitDate.toISOString();
    const endTime = new Date(visitDate.getTime() + 60 * 60000).toISOString();

    const hasUserExistingVisits = await patientDetails.checkExistingVisits(visitDate)
    const hasDoctorExistingVisits = await doctorDetails.checkExistingVisits(visitDate)

    if (hasUserExistingVisits){
      return res.status(400).json({ message: "User is not available on that day or time" });
    }

    if(hasDoctorExistingVisits){
      return res.status(400).json({ message: "Doctor is not available on that day or time" });
    }

    const newVisit = await Visit.create({ user, doctor, date, startTime, endTime });

    const visitDetails = {
      Id: newVisit.id,
      date: newVisit.date,
      patient: {
        firstName: patientDetails.firstName,
        lastName: patientDetails.lastName,
        taxId: patientDetails.taxId,
      },
      doctor: {
        firstName: doctorDetails.firstName,
        lastName: doctorDetails.lastName,
        taxId: doctorDetails.taxId,
        specialization: doctorDetails.specialization
      },
    };

    const userEmail = patientDetails.email;
    const doctorEmail = doctorDetails.email;

    await sendVisitConfirmationEmail(userEmail, doctorEmail, visitDetails);

    res.status(201).json({ message: "Visit created successfully", visit: visitDetails });
  } catch (err) {
    console.log(err)
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const getAllVisits = async (req, res, next) => {
  try {
    const visits = await Visit.find().populate({
      path: 'user doctor',
      select: 'firstName lastName taxId email phoneNumber specialization city profilePicture',
    });
    res.status(200).json(visits);
  } catch (err) {
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const getVisitById = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id).populate({
      path: 'user doctor',
      select: 'firstName lastName taxId email phoneNumber specialization city profilePicture',
    });

    if (!visit) {
      return res.status(404).json({message: "Visit not found"})
    }

    if (req.user.role === 'admin' || req.user.id === visit.user.id) {
        res.status(200).json(visit);
    } else {
        return res.status(403).json({message: "Permission denied."})
    }
  } catch (err) {
      next(errorHandler(500, 'Internal Server Error'));
  }
};

export const getVisitsByDoctorId = async (req, res, next) => {
    try {
      const { doctorId } = req.params;

      if (req.user.id !== doctorId && req.user.role !== 'admin') {
        return res.status(403).json({message: "Permission denied."})
      }

      const visits = await Visit.find({ doctor: doctorId }).populate({
        path: 'user doctor',
        select: 'firstName lastName taxId email phoneNumber specialization city profilePicture',
      });
      res.status(200).json(visits);
    } catch (err) {
        next(errorHandler(500, 'Internal Server Error'));
    }
};

export const getVisitsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({message: "Permission denied."})
    }

    const visits = await Visit.find({ user: userId }).populate({
      path: 'user doctor',
      select: 'firstName lastName taxId email phoneNumber specialization city profilePicture',
    });
    res.status(200).json(visits);
  } catch (err) {
      console.log(err)
      next(errorHandler(500, 'Internal Server Error'));
  }
};

export const updateVisit = async (req, res, next) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { id: visitId } = req.params;
      const authUserId = req.user.id;

      const visit = await Visit.findById(visitId);

      if (!visit || (visit.doctor.toString() !== authUserId && req.user.role !== 'admin')) {
        return res.status(403).json({message: "Permission denied."})
      }

      const { paid, cost } = req.body;

      let updateFields = {};

      if (paid) updateFields.paid = paid;
      if (cost) updateFields.cost = cost;

      const updatedVisit = await Visit.findByIdAndUpdate(
          visitId,
          { $set: updateFields },
          { new: true }
      ).populate({
        path: 'user doctor',
        select: 'firstName lastName email phoneNumber specialization city profilePicture',
      });

      if (!updatedVisit) {
          return next(errorHandler(404, "Visit not found"));
      }

      res.status(201).json({ message: "Visit data updated successfully", updatedVisit });
  } catch (err) {
      console.log(err);
      next(errorHandler(500, 'Internal Server Error'));
  }
};

export const deleteVisit = async (req, res, next) => {
    try {
      const { id: visitId } = req.params;
      const authUserId = req.user.id;
  
      const visit = await Visit.findById(visitId);
  
      if (!visit || (visit.user.toString() !== authUserId && req.user.role !== 'admin')) {
        return res.status(403).json({message:"Permission denied. You can only delete your own visits."})
      }

      const currentDate = new Date();
      const visitDate = new Date(visit.date);

      if (visitDate < currentDate) {
        return res.status(400).json({ message: "Visit date has already passed. You cannot delete past visits." });
      }
  
      const deletedVisit = await Visit.findByIdAndDelete(visitId).populate('user doctor');
  
      if (!deletedVisit) {
        return res.status(404).json({message:"Visit not found"})
      }

      const patientDetails = await User.findById(deletedVisit.user);
      const doctorDetails = await Doctor.findById(deletedVisit.doctor);

      const userEmail = patientDetails.email;
      const doctorEmail = doctorDetails.email;

      await sendVisitCancellationEmail(userEmail, doctorEmail, {
        date: deletedVisit.date,
        doctor: {
          firstName: doctorDetails.firstName,
          lastName: doctorDetails.lastName,
          taxId: doctorDetails.taxId,
          specialization: doctorDetails.specialization,
        },
        patient: {
          firstName: patientDetails.firstName,
          lastName: patientDetails.lastName,
          taxId: patientDetails.taxId,
        },
      });
  
      res.status(200).json({ message: "Visit deleted successfully", visit: deletedVisit });
    } catch (err) {
        next(errorHandler(500, 'Internal Server Error'));
    }
};
