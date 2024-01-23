export const validateLeaveRequests = (leaveRequests) => {
    for (const request of leaveRequests) {
        if (!request.typology) {
            return 'The "typology" field is required for each leave request.';
        }
        if (request.typology.toLowerCase() !== 'vacation' && request.typology.toLowerCase() !== 'leaves') {
            return 'The "typology" field must be either "vacations" or "leaves".';
        }
    }
    return null;
};

export const checkDuplicateLeaveRequests = (existingRequests, newRequests) => {
    if (!Array.isArray(existingRequests)) {
        return 'Invalid existing leave requests data.';
    }

    for (const newRequest of newRequests) {
        const isDuplicate = existingRequests.some(existingRequest =>
            new Date(newRequest.startDate).getTime() === new Date(existingRequest.startDate).getTime() &&
            new Date(newRequest.endDate).getTime() === new Date(existingRequest.endDate).getTime()
        );

        if (isDuplicate) {
            return 'Duplicate leave request found with the same start and end times.';
        }
    }
    return null;
};