import Cart from '../models/cart.js';

class CartRepository {
    async getCartByUser(userId) {
        return await Cart.findOne({ user: userId }).populate('items.product items.vendor');
    }

    async createOrUpdateCart(userId, items) {
        return await Cart.findOneAndUpdate(
            { user: userId },
            { items, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
    }

    async emptyCart(userId) {
        return await Cart.findOneAndUpdate(
            { user: userId },
            { items: [], updatedAt: Date.now() },
            { new: true }
        );
    }
}

export default CartRepository;