import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Your name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Your last name is required"]
    },
    taxId: {
        type: String,
        required: [true, "Your TaxID is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Your email address is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    phoneNumber: {
        type: String,
        default: "",
    },
    profilePicture: {
        type: String,
        default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
        default: null,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    twoFactorSecret: {
        type: String,
        default: "",
    }, 
    twoFactorEnabled: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

userSchema.methods.checkExistingVisits = async function (visitDate) {
    try {
      const startTime = visitDate.toISOString();
      const endTime = new Date(visitDate.getTime() + 60 * 60000).toISOString();
  
      const existingVisits = await this.model('Visit').find({
        user: this._id,
        startTime: { $lte: endTime },
        endTime: { $gt: startTime },
      });
  
      return existingVisits.length > 0;
    } catch (error) {
      console.error('Error checking existing visits:', error);
      throw error;
    }
};

const User = mongoose.model('User', userSchema)

export default User