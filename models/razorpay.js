import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    },
    
    name: {
        type: String,
        ref: 'student',
        required: true,
    },

    email: {
        type: String,
        ref: 'student',
        required: true,
    },
    mobile: {
        type: String,
        ref: 'student',
        required: true,
    },

}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
