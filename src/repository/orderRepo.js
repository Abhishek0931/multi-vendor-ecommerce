import Order from '../models/order.js';

class OrderRepository {
    constructor() {
        this.model = Order;
    }

    async createOrder(orderData) {
        return await Order.create(orderData);
    }
    async getOrderById(orderId) {
        return await Order.findById(orderId).populate('items.product items.vendor user coupon');
    }
    async getOrdersByUser(userId) {
        return await Order.find({ user: userId }).populate('items.product items.vendor coupon');
    }
    async getOrdersByUserPaginated(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find({ user: userId })
                .populate('items.product items.vendor coupon')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Order.countDocuments({ user: userId })
        ]);
        return {
            orders,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getOrdersByVendor(vendorId) {
        return await Order.find({ 'items.vendor': vendorId }).populate('items.product user coupon');
    }
    async getOrdersByVendorPaginated(vendorId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find({ 'items.vendor': vendorId })
                .populate('items.product user coupon')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Order.countDocuments({ 'items.vendor': vendorId })
        ]);
        return {
            orders,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }

    async updateOrderStatus(orderId, status) {
        return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    }
    async cancelOrder(orderId) {
        return await Order.findByIdAndUpdate(orderId, { status: 'cancelled' }, { new: true });
    }

    async hasUserOrderedProduct(userId, productId) {
        return await this.model.exists({
            user: userId,
            'items.product': productId,
            status: { $ne: 'cancelled' }
        });
    }
}

export default OrderRepository;