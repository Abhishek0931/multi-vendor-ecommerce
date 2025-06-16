import OrderService from '../services/orderService.js';
import User from '../models/user.js';

const orderService = new OrderService();

// Place Order (blocked users cannot place orders)
export const placeOrder = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || user.isBlocked) {
            return res.status(403).json({ message: 'User is blocked or not found' });
        }

        const { shippingAddress, billingAddress, paymentInfo } = req.body;
        if (!billingAddress) billingAddress = shippingAddress;
        const order = await orderService.placeOrder(req.user._id, shippingAddress, billingAddress, paymentInfo);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Get Order By ID (authorization: admin, order owner, or vendor in order)
export const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.orderId);
        const user = req.user;

        if (user.role === 'admin') return res.json(order);

        if (order.user.equals(user._id)) return res.json(order);

        const isVendorInOrder = order.items.some(
            item => item.vendor.equals(user._id)
        );
        if (user.role === 'vendor' && isVendorInOrder) return res.json(order);
        
        return res.status(403).json({ message: 'Forbidden' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get all orders for the logged-in user (authorization: user or admin)
export const getUserOrders = async (req, res) => {
    try {
        const user = req.user;
        // Only admin or the user themselves can access
        if (user.role !== 'admin') {
            // Only allow the logged-in user to get their own orders
            const orders = await orderService.getOrdersByUser(user._id);
            return res.json(orders);
        }
        // If admin, you may want to allow fetching all orders or require a userId param
        const orders = await orderService.getOrdersByUser(user._id); // or all users if you want
        res.json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all orders for the logged-in vendor (authorization: vendor or admin)
export const getVendorOrders = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin' && user.role !== 'vendor') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const orders = await orderService.getOrdersByVendor(user._id);
        res.json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Update order status (authorization: admin, order qwner, or vendor in order)
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.orderId);
        const user = req.user;

        if (
            user.role === 'admin' ||
            order.user.equals(user._id) ||
            (user.role === 'vendor' && order.items.some(item => item.vendor.equals(user._id)))
        ) {
            const updatedOrder = await orderService.updateOrderStatus(req.params.orderId, req.body.status);
            res.json(updatedOrder);
        }

        return res.status(403).json({ message: 'Forbidden' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.orderId);
        const user = req.user;

        if (
            user.role === 'admin' ||
            order.user.equals(user._id) ||
            (user.role === 'vendor' && order.items.some(item => item.vendor.equals(user._id)))
        ) {
            const cancelledOrder = await orderService.cancelOrder(req.params.orderId);
            return res.json(cancelledOrder);
        }

        return res.status(403).json({ message: 'Forbidden' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};