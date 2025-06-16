import CouponService from '../services/couponService.js';

const couponService = new CouponService();

export const createCoupon = async (req, res) => {
    try {
        const coupon = await couponService.createCoupon(req.body);
        res.status(201).json(coupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getCouponByCode = async (req, res) => {
    try {
        const coupon = await couponService.getCouponByCode(req.params.code);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getCouponById = async (req, res) => {
    try {
        const coupon = await couponService.getCouponById(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await couponService.getAllCoupons();
        res.json(coupons);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCoupon = async (req, res) => {
    try {
        const coupon = await couponService.updateCoupon(req.params.id, req.body);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await couponService.deleteCoupon(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};