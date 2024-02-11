import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        unique: true
    },
    invoiceFile: {
        type: String
    }
}, { _id: false });

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
    amount: {
        type: Number,
        default: 0,
        min: 0 
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit card', 'paypal', 'bank transfer', 'debit card']
    },
    invoice: {
        type: invoiceSchema,
        default: {}
    }
}, {timestamps: true});

const Visit = mongoose.model('Visit', visitSchema);

export default Visit;
