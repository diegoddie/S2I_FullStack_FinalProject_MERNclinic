import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    doctor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    paid: { 
        type: Boolean, 
        default: false 
    },
    cost: {
        type: Number,
        default: 0,
        min: 0 
    }
}, {timestamps: true});

const Visit = mongoose.model('Visit', visitSchema);

export default Visit;
