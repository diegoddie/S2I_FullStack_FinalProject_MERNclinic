import mongoose from "mongoose";

// Define the workShift schema as a separate object
const workShiftSchema = {
    _id: false,
    dayOfWeek: {
        type: String,
        required: true,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    startTime: {
        type: String,
        required: true,
        default: "09:00"
    },
    endTime: {
        type: String,
        required: true,
        default: function () {
            return this.dayOfWeek === "Saturday" ? "13:00" : "19:00";
        },
    },
};

const doctorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    email: {
        type: String,
        required: [true, "An email address is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "A password is required"],
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
    },
    specialization: { 
        type: String, 
        required: [true, "Specialization is required"], 
    },
    city: {
        type: String,
        required: [true, "City is required"],
    },
    profilePicture: {
        type: String,
        default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    },
    twoFactorSecret: {
        type: String
    }, 
    twoFactorEnabled: {
        type: Boolean,
        default: false,
    },
    workShifts: {
        type: [workShiftSchema],
        default: [
            { dayOfWeek: "Monday" },
            { dayOfWeek: "Tuesday" },
            { dayOfWeek: "Wednesday" },
            { dayOfWeek: "Thursday" },
            { dayOfWeek: "Friday" },
            { dayOfWeek: "Saturday", endTime: "13:00" },  
        ]
    },
    nonAvailability: {
        type: [{
            _id: false,
            startDate: {
                type: Date,
                required: true,
            },
            endDate: {
                type: Date,
                required: true,
            },
        }],
        default: []
    },
}, {timestamps: true});

doctorSchema.methods.isAvailable = async function (visitDate) {
    // If the doctor is not scheduled to work on the chosen day, return false
    // Extract the day of the week (e.g., "Monday") from the visitDate
    const dayOfWeek = visitDate.toLocaleDateString('en-US', { weekday: 'long' });
    // Find the work shift for the specific day of the week in the doctor's schedule
    const workDay = this.workShifts.find(shift => shift.dayOfWeek === dayOfWeek);

    if (!workDay) {
        return false;
    }

    // Utility function to check if the visit is during the doctor's work shift
    const isDuringWorkShift = () => {
        const startTime = new Date(`${visitDate.toISOString().split('T')[0]} ${workDay.startTime}`);
        const endTime = new Date(`${visitDate.toISOString().split('T')[0]} ${workDay.endTime}`);
        return visitDate >= startTime && visitDate < endTime;
    };

    // Utility function to check if the visit is during the lunch break
    const isDuringLunchBreak = () => {
        const lunchBreakStartTime = new Date(`${visitDate.toISOString().split('T')[0]} 13:00`);
        const lunchBreakEndTime = new Date(`${visitDate.toISOString().split('T')[0]} 14:00`);
        return visitDate >= lunchBreakStartTime && visitDate < lunchBreakEndTime;
    };

    // Utility function to check if the doctor is non available
    const isNonAvailable = () => this.nonAvailability.some(nonAvailable => visitDate >= nonAvailable.startDate && visitDate <= nonAvailable.endDate);

    // Return true if the doctor is available (during work shift, not on vacation, and not during lunch break)
    return isDuringWorkShift() && !isNonAvailable() && !isDuringLunchBreak();
};

doctorSchema.methods.checkExistingVisits = async function (visitDate) {
    try {
      const startTime = visitDate.toISOString();
      const endTime = new Date(visitDate.getTime() + 30 * 60000).toISOString();
  
      const existingVisits = await this.model('Visit').find({
        doctor: this._id,
        startTime: { $lte: endTime },
        endTime: { $gt: startTime },
      });
  
      return existingVisits.length > 0;
    } catch (error) {
      console.error('Error checking existing visits:', error);
      throw error;
    }
};

const Doctor = mongoose.model('Doctor', doctorSchema)

export default Doctor