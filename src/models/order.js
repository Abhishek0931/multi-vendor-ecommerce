import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingAddress: { type: String, required: true },
    billingAddress: { type: String, required: true },
    paymentInfo: { type: Object }, // You can expand this as needed
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    paymentInfo: { 
        method: { type: String, enum: ['COD', 'debit_card', 'credit_card', 'UPI', 'net_banking'], required: true},
        gateway: { type: String, enum: ['razorpay', 'stripe', 'phonepe', 'paytm', 'google_pay', 'none'], default: 'none' },        
        status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending'},
        transactionId: { type: String },
        paymentDetails: { type: Object } 
        },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);