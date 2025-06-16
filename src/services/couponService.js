import CouponRepository from '../repository/couponRepo.js';

const couponRepo = new CouponRepository();

class CouponService {
    async createCoupon(data) {
        return await couponRepo.createCoupon(data);
    }
    async getCouponByCode(code) {
        return await couponRepo.getCouponByCode(code);
    }
    async getCouponById(id) {
        return await couponRepo.getCouponById(id);
    }
    async getAllCoupons() {
        return await couponRepo.getAllCoupons();
    }
    async updateCoupon(id, data) {
        return await couponRepo.updateCoupon(id, data);
    }
    async deleteCoupon(id) {
        return await couponRepo.deleteCoupon(id);
    }
}

export default CouponService;