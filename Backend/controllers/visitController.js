import Visit from "../models/visitModel.js";
import { errorHandler } from "../utils/error.js";
import { validationResult } from 'express-validator';
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import { sendVisitConfirmationEmail } from "../utils/visitEmails/visitConfirmationEmail.js";
import { sendVisitUpdateEmail } from "../utils/visitEmails/visitUpdateEmail.js";
import { sendVisitCancellationEmail } from "../utils/visitEmails/visitCancellationEmail.js";
import { validateVisit } from "../utils/validateVisit.js";

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
    const visitDate = new Date(date);
    const currentDate = new Date();

    if (visitDate <= currentDate) {
      return res.status(400).json({ message: "Visit date must be in the future" });
    }

    const doctorDetails = await Doctor.findById(doctor);
    const patientDetails = await User.findById(user);

    const minutes = visitDate.getMinutes();
    if (minutes % 30 !== 0) {
      return res.status(400).json({ message: "Visit must be scheduled in half-hour intervals" });
    }

    const startTime = visitDate.toISOString(); 
    const endTime = new Date(visitDate.getTime() + 30 * 60000).toISOString();

    const isDoctorAvailable = await doctorDetails.isAvailable(visitDate);
    const hasUserExistingVisits = await patientDetails.checkExistingVisits(visitDate)
    const hasDocExistingVisits = await doctorDetails.checkExistingVisits(visitDate)

    if (!isDoctorAvailable || hasDocExistingVisits) {
      return res.status(400).json({ message: "The doctor is not available on that day or time" });
    }else if(hasUserExistingVisits){
      return res.status(400).json({ message: "User is not available on that day or time" });
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
      select: 'firstName lastName email phoneNumber specialization city profilePicture',
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
      select: 'firstName lastName email phoneNumber specialization city profilePicture',
    });

    if (!visit) {
      return next(errorHandler(404, "Visit not found"));
    }

    if (req.user.role === 'admin' || req.user.id === visit.user.id) {
        res.status(200).json(visit);
    } else {
        return next(errorHandler(403, 'Permission denied. You can only access your own visits.'));
    }
  } catch (err) {
      next(errorHandler(500, 'Internal Server Error'));
  }
};

export const getVisitsByDoctorId = async (req, res, next) => {
    try {
      const { doctorId } = req.params;
      const visits = await Visit.find({ doctor: doctorId }).populate({
        path: 'user doctor',
        select: 'firstName lastName email phoneNumber specialization city profilePicture',
      });
      res.status(200).json(visits);
    } catch (err) {
        next(errorHandler(500, 'Internal Server Error'));
    }
};

export const getVisitsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!(req.user.role === 'admin' || req.user.id === userId)) {
      return next(errorHandler(403, 'Permission denied. You can only access your own visits.'));
    }

    const visits = await Visit.find({ user: userId }).populate({
      path: 'user doctor',
      select: 'firstName lastName email phoneNumber specialization city profilePicture',
    });
    res.status(200).json(visits);
  } catch (err) {
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
      const originalDate = visit.date;
      const patientDetails = await User.findById(visit.user);
      const doctorDetails = await Doctor.findById(visit.doctor);

      // Check user permissions
      if (!visit || (visit.user.toString() !== authUserId && visit.doctor.toString() !== authUserId && req.user.role !== 'admin')) {
          return next(errorHandler(403, 'Permission denied. You can only update your own visits.'));
      }

      const { date, paid, cost } = req.body;

      let updateFields = {};

      if (paid) {
          updateFields.paid = paid;
      }

      if (cost) {
          updateFields.cost = cost;
      }

      if (date) {
          const newVisitDate = new Date(date);
          try {
              const isNewDateAvailable = await validateVisit(newVisitDate, patientDetails, doctorDetails);
              if (isNewDateAvailable){
                updateFields.date = newVisitDate.toISOString();
                updateFields.startTime = newVisitDate.toISOString();
                updateFields.endTime = new Date(newVisitDate.getTime() + 30 * 60000).toISOString();
              }
          } catch (validationError) {
              return res.status(400).json({ message: validationError.message });
          }
      }

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

      if (date) {
          const userEmail = patientDetails.email;
          const doctorEmail = doctorDetails.email;

          const visitDetails = {
            originalDate: originalDate,
            newDate: updatedVisit.date,
            doctor: {
                firstName: doctorDetails.firstName,
                lastName: doctorDetails.lastName,
                specialization: doctorDetails.specialization,
            },
            patient: {
                firstName: patientDetails.firstName,
                lastName: patientDetails.lastName,
                taxId: patientDetails.taxId,
            },
          }

          await sendVisitUpdateEmail(userEmail, doctorEmail, visitDetails);
      }

      res.status(201).json({ message: "Visit updated successfully", updatedVisit });
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
        return next(errorHandler(403, 'Permission denied. You can only delete your own visits.'));
      }
  
      const deletedVisit = await Visit.findByIdAndDelete(visitId).populate('user doctor');
  
      if (!deletedVisit) {
        return next(errorHandler(404, "Visit not found"));
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
