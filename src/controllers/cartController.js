import CartService from '../services/cartService.js';
import Joi from 'joi';

const cartService = new CartService();

const addItemSchema = Joi.object({
    product: Joi.string().required(),
    variant: Joi.string().required(),
    vendor: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required()
});

export const getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user._id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addItem = async (req, res) => {
    try {
        const { error } = addItemSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const cart = await cartService.addItem(req.user._id, req.body);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const removeItem = async (req, res) => {
    try {
        const { productId, variantId, vendorId } = req.params;
        const cart = await cartService.removeItem(req.user._id, productId, variantId, vendorId);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const emptyCart = async (req, res) => {
    try {
        const cart = await cartService.emptyCart(req.user._id);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const applyCoupon = async (req, res) => {
    try {
        const { couponCode } = req.body;
        const cart = await cartService.applyCoupon(req.user._id, couponCode);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const removeCoupon = async (req, res) => {
    try {
        const cart = await cartService.removeCoupon(req.user._id);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};