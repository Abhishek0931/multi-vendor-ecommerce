import OrderService from '../services/orderService.js';
import User from '../models/user.js';
import Order from '../models/order.js';

const orderService = new OrderService();

// Place Order (blocked users cannot place orders)
export const placeOrder = async (req, res) => {
    try {
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
        const { orderId } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        // Fetch the order with product and vendor details
        const order = await Order.findById(orderId)
            .populate({
                path: 'items.product',
                select: 'vendor',
                populate: { path: 'vendor', select: '_id' }
            })
            .lean();

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the user is the order owner
        const isOrderOwner = order.user.toString() === userId.toString();

        // Check if the user is a vendor for any product in the order
        const isVendor = order.items.some(item =>
            item.product.vendor && item.product.vendor._id.toString() === userId.toString()
        );

        // Check if the user is an admin
        const isAdmin = userRole === 'admin';

        if (!isOrderOwner && !isVendor && !isAdmin) {
            return res.status(403).json({ message: 'Forbidden: You are not authorized to view this order.' });
        }

        return res.json(order);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get all orders for the logged-in user (authorization: user or admin)
export const getUserOrders = async (req, res) => {
    try {
        const user = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Only admin or the user themselves can access
        if (user.role !== 'admin') {
            // Only allow the logged-in user to get their own orders
            const result = await orderService.getOrdersByUserPaginated(user._id, page, limit);
            return res.json(result);
        }
        // If admin, you may want to allow fetching all orders or require a userId param
        const result = await orderService.getOrdersByUserPaginated(user._id, page, limit); // or all users if you want
        res.json(result);
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await orderService.getOrdersByVendor(user._id, page, limit);
        res.json(result);
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
            const { shipmentStatus, paymentStatus } = req.body;
            const updatedOrder = await orderService.updateOrderStatus(
                req.params.orderId, 
                { shipmentStatus, paymentStatus }
            );
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

export const confirmPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        await orderService.markOrderAsPaid(orderId);
        res.json({ message: 'Order marked as paid and inventory updated.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};