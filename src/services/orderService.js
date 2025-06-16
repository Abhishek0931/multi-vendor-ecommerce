import OrderRepository from '../repository/orderRepo.js';
import CartRepository from '../repository/cartRepo.js';

const orderRepo = new OrderRepository();
const cartRepo = new CartRepository();

class OrderService {
    async placeOrder(userId, shippingAddress, paymentInfo) {
        const cart = await cartRepo.getCartByUser(userId);
        if (!cart || !cart.items.length) throw new Error('Cart is empty');

        const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const orderData = {
            user: userId,
            items: cart.items,
            totalAmount,
            shippingAddress,
            paymentInfo,
            status: 'pending'
        };

        const order = await orderRepo.createOrder(orderData);

        // Optionally, empty the user's cart after order
        cart.items = [];
        await cart.save();

        return order;
    }

    async getOrderById(orderId) {
        return await orderRepo.getOrderById(orderId);
    }

    async getOrdersByUser(userId) {
        return await orderRepo.getOrdersByUser(userId);
    }

    async getOrdersByVendor(vendorId) {
        return await orderRepo.getOrdersByVendor(vendorId);
    }

    async updateOrderStatus(orderId, status) {
        return await orderRepo.updateOrderStatus(orderId, status);
    }

    async cancelOrder(orderId) {
        return await orderRepo.cancelOrder(orderId);
    }
}

export default OrderService;