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
        default: "08:00"
    },
    endTime: {
        type: String,
        required: true,
        default: function () {
            return this.dayOfWeek === "Saturday" ? "12:00" : "18:00";
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
    taxId: {
        type: String,
        required: [true, "Your TaxID is required"],
        unique: true,
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
    about: {
        type: String,
        default: "",
    },
    profilePicture: {
        type: String,
        default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
        default: null,
    },
    twoFactorSecret: {
        type: String,
        default: "",
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
            { dayOfWeek: "Saturday", endTime: "12:00" },  
        ]
    },
    leaveRequests: {
        type: [{
            createdAt: {
                type: Date,
                default: Date.now,
            },
            typology: {
                type: String,
                required: true,
            },
            startDate: {
                type: Date,
                required: true,
            },
            endDate: {
                type: Date,
                required: true,
            },
            isApproved: {
                type: Boolean,
                default: null,
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
        // Estrai la data in formato ISO (escludendo l'orario) dalla data della visita
        const visitDateISO = visitDate.toISOString().split('T')[0];

        const startTime = new Date(`${visitDateISO}T${workDay.startTime}:00Z`);
        const endTime = new Date(`${visitDateISO}T${workDay.endTime}:00Z`);
        return visitDate >= startTime && visitDate < endTime;
    };

    const isDuringLunchBreak = () => {
        // Estrai la data in formato ISO (escludendo l'orario) dalla data della visita
        const visitDateISO = visitDate.toISOString().split('T')[0];
        // Costruisci un oggetto Date per l'inizio del break pranzo (alle 13:00) utilizzando la data della visita e l'orario fisso
        const lunchBreakStartTime = new Date(`${visitDateISO}T12:00:00Z`);
        // Costruisci un oggetto Date per la fine del break pranzo (alle 14:00) utilizzando la data della visita e l'orario fisso
        const lunchBreakEndTime = new Date(`${visitDateISO}T13:00:00Z`);
        // Verifica se la data della visita è compresa tra l'inizio e la fine del break pranzo
        return visitDate >= lunchBreakStartTime && visitDate < lunchBreakEndTime;
    };

    const isOnLeave = () => {
        return this.leaveRequests.some(leave => visitDate >= leave.startDate && visitDate <= leave.endDate && leave.isApproved);
    };

    return isDuringWorkShift() && !isOnLeave() && !isDuringLunchBreak();
};

doctorSchema.methods.checkExistingVisits = async function (visitDate) {
    try {
      const startTime = visitDate.toISOString();
      const endTime = new Date(visitDate.getTime() + 60 * 60000).toISOString();
      
      const existingVisits = await this.model('Visit').find({
        doctor: this._id,
        startTime: { $lt: endTime },
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