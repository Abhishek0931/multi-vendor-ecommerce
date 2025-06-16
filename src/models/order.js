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
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingAddress: { type: String, required: true },
    paymentInfo: { type: Object }, // You can expand this as needed
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);