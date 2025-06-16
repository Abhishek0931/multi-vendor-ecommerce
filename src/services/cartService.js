import Cart from '../models/cart.js';
import Product from '../models/product.js';
import User from '../models/user.js';
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

        cart.items = cart.items.filter(i => i.product && i.variant && i.vendor);
        await cart.save();
        return cart;
    }

    async emptyCart(userId) {
        const cart = await cartRepo.getCartByUser(userId);
        if (!cart) throw new Error('Cart not found');
        cart.items = [];
        await cart.save();
        return cart;
    }
}

export default CartService;