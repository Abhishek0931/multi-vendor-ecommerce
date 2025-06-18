import Cart from '../models/cart.js';
import Product from '../models/product.js';
import User from '../models/user.js';
import Coupon from '../models/coupon.js';
import CartRepository from '../repository/cartRepo.js';

const cartRepo = new CartRepository();

class CartService {
    async getCart(userId) {
        const cart = await cartRepo.getCartByUser(userId);
        if (!cart) return { user: userId, items: [] };
        return cart;
    }

    async addItem(userId, item) {
        // Always use ObjectIds from DB for comparison and storage
        const product = await Product.findById(item.product);
        if (!product) throw new Error('Product not found');
        const variant = product.variants.id(item.variant);
        if (!variant) throw new Error('Variant not found');
        const vendor = await User.findById(item.vendor);
        if (!vendor || vendor.role !== 'vendor') throw new Error('Vendor not found');

        let cart = await cartRepo.getCartByUser(userId);
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existing = cart.items.find(
            i =>
                i.product && i.variant && i.vendor &&
                i.product.equals(product._id) &&
                i.variant.equals(variant._id) &&
                i.vendor.equals(vendor._id)
        );

         if (existing) {
            existing.quantity += item.quantity;
        } else {
            cart.items.push({
                product: product._id,
                variant: variant._id,
                vendor: vendor._id,
                quantity: item.quantity,
                price: variant.price
            });
        }

        // Remove any invalid items
        cart.items = cart.items.filter(i => i.product && i.variant && i.vendor);

        // Recalculate totals after adding/updating item
        const totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        cart.finalAmount = totalAmount - (cart.discount || 0);

        await cart.save();
        return cart;
    }

    async removeItem(userId, productId, variantId, vendorId) {
        const product = await Product.findById(productId);
        if (!product) throw new Error('Product not found');

        const variant = product.variants.id(variantId);
        if (!variant) throw new Error('Variant not found');

        const vendor  = await User.findById(vendorId);
        if (!vendor || vendor.role !== 'vendor') throw new Error('Vendor not found');

        let cart = await cartRepo.getCartByUser(userId);
        if (!cart) throw new Error('Cart not found');

        const existing = cart.items.find(
            i =>
                i.product && i.variant && i.vendor &&
                i.product.equals(product._id) &&
                i.variant.equals(variant._id) &&
                i.vendor.equals(vendor._id)
        );

        if (existing) {
            // Decrease quantity by 1
            existing.quantity -= 1;
            // Remove if quantity is 0 or less
            if (existing.quantity <= 0) {
                cart.items = cart.items.filter(i =>
                    !(
                        i.product.equals (product._id) && 
                        i.variant.equals (variant._id) &&
                        i.vendor.equals (vendor._id)
                    )
                );
            }
        }

        // remove any invalid items
        cart.items = cart.items.filter(i => i.product && i.variant && i.vendor);

        // Recalculate totals after removing/updating item
        const totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        cart.finalAmount = totalAmount - (cart.discount || 0);

        await cart.save();
        return cart;
    }

    async emptyCart(userId) {
        const cart = await cartRepo.getCartByUser(userId);
        if (!cart) throw new Error('Cart not found');

        cart.items = [];
        cart.coupon = undefined;
        cart.discount = 0;
        cart.finalAmount = 0;
        cart.updatedAt = Date.now();
        await cart.save();
        return cart;
    }

    async applyCoupon(userId, couponCode) {
        const cart = await cartRepo.getCartByUser(userId);
        if (!cart || !cart.items.length) throw new Error('Cart is empty');

        const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
        if (!coupon) throw new Error('Invalid coupon');

        if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error('Coupon expired');

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new Error('Coupon usage limit reached');
        
        if (coupon.userUsed.includes(userId)) throw new Error('Coupon already used by this user');

        const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (totalAmount < coupon.minOrderAmount) throw new Error('Order does not meet minimum amount for coupon');

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (totalAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
            discount = coupon.discountValue;
        }
        discount = Math.min(discount, totalAmount);

        cart.coupon = coupon._id;
        cart.discount = discount;
        cart.finalAmount = totalAmount - discount;

        await cart.save();
        return cart;
    }

    async removeCoupon(userId) {
        const cart = await cartRepo.getCartByUser(userId);
        if (!cart) throw new Error('Cart not found');
        cart.coupon = undefined;
        cart.discount = 0;
        cart.finalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await cart.save();
        return cart;
    }
}

export default CartService;