import Coupon from '../models/coupon.js';
import User from '../models/user.js';
import Product from '../models/product.js';
import OrderRepository from '../repository/orderRepo.js';
import CartRepository from '../repository/cartRepo.js';
import InventoryService from './inventoryService.js';

const orderRepo = new OrderRepository();
const cartRepo = new CartRepository();
const inventoryService = new InventoryService();

class OrderService {
    async placeOrder(userId, shippingAddress, billingAddress, paymentInfo) {
        
        // Check if the user exists and is not blocked
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        if (user.isBlocked) throw new Error('Your account is blocked. You cannot place orders.');
        
        const cart = await cartRepo.getCartByUser(userId);
        if (!cart || !cart.items.length) throw new Error('Cart is empty');

        // Check if all products are approved
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product) throw new Error ('Product not found');
            if (!product.isApproved) {
                throw new Error(`Product ${product.name} is not approved for sale`);
            }
        }
        // Check if the coupon applied is valid or not
        if (cart.coupon) {
            const coupon = await Coupon.findById(cart.coupon);
            if (
                !coupon ||
                !coupon.isActive ||
                (coupon.expiresAt && coupon.expiresAt < new Date()) ||
                (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) ||
                coupon.userUsed.includes(userId)
            ) {
                throw new Error('coupon is no longer valid or has expired');
            }
        }

        // Reserve stock for each item before placing the order
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product) throw new Error('Product not found');
            if (!product.isApproved) {
                throw new Error(`Product ${product.name} is not approved for sale`);
            }

            //check if vendor is blocked
            const vendor = await User.findById(item.vendor);
            if (!vendor) throw new Error ('Vendor not found');
            if (vendor.isBlocked) {
                throw new Error(`Vendor for product ${product.name} is blocked. YOu cannot checkout this item.`);
            }
            await inventoryService.reserveStock(item.product, item.variant, item.vendor, item.quantity);
        }

        const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = cart.discount || 0;
        const finalAmount = cart.finalAmount || (totalAmount - discount);

        const orderData = {
            user: userId,
            items: cart.items,
            totalAmount,
            discount,
            finalAmount,
            coupon: cart.coupon,
            shippingAddress,
            billingAddress,
            paymentInfo,
            status: 'pending'
        };

        const order = await orderRepo.createOrder(orderData);

        // Optionally, mark coupon as used by this user
        if (cart.coupon) {
            const coupon = await Coupon.findById(cart.coupon);
            if (coupon) {
                coupon.usedCount += 1;
                coupon.userUsed.push(userId);
                await coupon.save();
            }
        }

        // Optionally, empty the user's cart after order
        cart.items = [];
        cart.coupon = undefined;
        cart.discount = 0;
        cart.finalAmount = 0;
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

    async updateOrderStatus(orderId, { shipmentStatus, paymentStatus }) {
        const order = await orderRepo.getOrderById(orderId);
        if (!order) throw new Error('Order not found');

        // Prevent updates if already cancelled
        if (order.status === 'cancelled') {
            throw new Error('Cannot update a cancelled order');
        }

        // Prevent cancelling after shipped/delivered
        if (
            shipmentStatus === 'cancelled' &&
            (order.status === 'shipped' || order.status === 'delivered')
        ) {
            throw new Error('Order cannot be cancelled after being shipped');
        }

        // Optionally: Only allow valid transitions
        // (You can add more logic here if needed)

        if (shipmentStatus) {
        order.status = shipmentStatus;
        }
        if (paymentStatus) {
            order.paymentInfo.status = paymentStatus;
        }       
        
        await order.save();
        return order;
    }

    async cancelOrder(orderId) {
        const order = await orderRepo.getOrderById(orderId);
        if (!order) throw new Error('Order not found');

        // Prevent canccellation if order is shipped or beyond
        if (order.status === 'shipped' || order.status === 'delivered') {
            throw new Error ('Order cannot be cancelled after it has been shipped or delivered');
        }

        if (order.status === 'cancelled') return order; // Already cancelled

        // Release reserved stock for each item in the order
        for (const item of order.items) {
            await inventoryService.releaseReserved(item.product, item.variant, item.vendor, item.quantity);
        }

        order.status = 'cancelled';
        await order.save();

        // Adjust coupon usage if a coupon was used
        if (order.coupon) {
            const coupon = await Coupon.findById(order.coupon);
            if (coupon) {
                // Decrement usedCount, but not below 0
                coupon.usedCount = Math.max(0, coupon.usedCount - 1);
                // Remove user from userUsed
                coupon.userUsed = coupon.userUsed.filter(
                    userId => userId.toString() !== order.user.toString()
                );
                await coupon.save();
            }
        }
        return order;
    }

    async markOrderAsPaid(orderId) {
        const order = await orderRepo.getOrderById(orderId);
        if (!order) throw new Error('Order not found');

        // Deduct reserved stock for each item
        for (const item of order.items) {
            await inventoryService.deductReserved(item.product, item.variant, item.vendor, item.quantity);
        }

        order.paymentInfo.status = 'paid';
        // Optionally, move to next shipment stage if you want
        if (order.status === 'pending') {
            order.status = 'processing';
        }
        await order.save();
        return order;
    }
}

export default OrderService;