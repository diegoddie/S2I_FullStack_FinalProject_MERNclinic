import { errorHandler } from "../error.js";

export const validateVisit = async (newVisitDate, patientDetails, doctorDetails) => {
    const currentDate = new Date();
    const minutes = newVisitDate.getMinutes();

    const hasUserExistingVisits = await patientDetails.checkExistingVisits(newVisitDate);
    const isDoctorAvailable = await doctorDetails.isAvailable(newVisitDate);
    const hasDocExistingVisits = await doctorDetails.checkExistingVisits(newVisitDate);

    if (newVisitDate <= currentDate) {
        throw errorHandler(400, "Visit date must be in the future");
    }

    if (minutes % 30 !== 0) {
        throw errorHandler(400, "Visit must be scheduled in half-hour intervals");
    }

    if (!isDoctorAvailable || hasDocExistingVisits) {
        throw errorHandler(400, "The doctor is not available on that day or time");
    } else if (hasUserExistingVisits) {
        throw errorHandler(400, "User is not available on that day or time");
    }

    return true
};

