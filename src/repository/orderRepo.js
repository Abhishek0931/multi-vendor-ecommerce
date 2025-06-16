import Order from '../models/order.js';

class OrderRepository {
    async createOrder(orderData) {
        return await Order.create(orderData);
    }
    async getOrderById(orderId) {
        return await Order.findById(orderId).populate('items.product items.vendor user');
    }
    async getOrdersByUser(userId) {
        return await Order.find({ user: userId }).populate('items.product items.vendor');
    }
    async getOrdersByVendor(vendorId) {
        return await Order.find({ 'items.vendor': vendorId }).populate('items.product user');
    }
    async updateOrderStatus(orderId, status) {
        return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    }
    async cancelOrder(orderId) {
        return await Order.findByIdAndUpdate(orderId, { status: 'cancelled' }, { new: true });
    }
}

export default OrderRepository;