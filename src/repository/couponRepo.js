import Coupon from '../models/coupon.js';

class CouponRepository {
    async createCoupon(data) {
        return await Coupon.create(data);
    }
    async getCouponByCode(code) {
        return await Coupon.findOne({ code });
    }
    async getCouponById(id) {
        return await Coupon.findById(id);
    }
    async getAllCoupons() {
        return await Coupon.find();
    }
    async updateCoupon(id, data) {
        return await Coupon.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteCoupon(id) {
        return await Coupon.findByIdAndDelete(id);
    }
}

export default CouponRepository;