import User from '../models/user.js';
import Order from '../models/order.js';
import Product from '../models/product.js';

export const getAdminDashboard = async (req, res) => {
    try {
        // Total users and vendors
        const totalUsers = await User.countDocuments({ role: 'buyer' });
        const totalVendors = await User.countDocuments({ role: 'vendor' });
        const blockedUsers = await User.countDocuments({ role: 'buyer', isBlocked: true });
        const blockedVendors = await User.countDocuments({ role: 'vendor', isBlocked: true });

        // Orders
        const totalOrders = await Order.countDocuments();
        const paidOrders = await Order.countDocuments({ 'paymentInfo.status': 'paid' });
        const pendingOrders = await Order.countDocuments({ 'paymentInfo.status': 'pending' });
        const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

        // Total sales (sum of finalAmount for paid orders)
        const salesAgg = await Order.aggregate([
            { $match: { 'paymentInfo.status': 'paid' } },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } }
        ]);
        const totalSales = salesAgg[0]?.total || 0;

        // Top-selling products
        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.product', sold: { $sum: '$items.quantity' } } },
            { $sort: { sold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            { $project: { _id: 0, productId: '$_id', name: '$product.name', sold: 1 } }
        ]);

        // Top vendors by sales
        const topVendors = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.vendor', sales: { $sum: '$items.price' } } },
            { $sort: { sales: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'vendor'
                }
            },
            { $unwind: '$vendor' },
            { $project: { _id: 0, vendorId: '$_id', name: '$vendor.name', sales: 1 } }
        ]);

        // Recent orders
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            totalUsers,
            totalVendors,
            blockedUsers,
            blockedVendors,
            totalOrders,
            paidOrders,
            pendingOrders,
            cancelledOrders,
            totalSales,
            topProducts,
            topVendors,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};