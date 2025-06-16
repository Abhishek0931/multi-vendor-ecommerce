import mongoose from 'mongoose';
const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number }, // for percentage coupons
    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number }, // total uses allowed
    usedCount: { type: Number, default: 0},
    userUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    },{ timestamps: true }
);

export default mongoose.model('Coupon', couponSchema);