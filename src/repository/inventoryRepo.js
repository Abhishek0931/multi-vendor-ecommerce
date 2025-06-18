import Inventory from '../models/inventory.js';

class InventoryRepository {
    async getInventory(product, variant, vendor) {
        return await Inventory.findOne({ product, variant, vendor }).populate('product vendor');
    }

    async getAllInventory() {
        return await Inventory.find().populate('product vendor');
    }

    async getAllInventoryByVendor(vendor) {
        return await Inventory.find({ vendor }).populate('product vendor');
    }

    async updateStock(product, variant, vendor, stock) {
        return await Inventory.findOneAndUpdate(
            { product, variant, vendor },
            { $set: { stock, updatedAt: new Date() } },
            { new: true, upsert: true }
        );
    }

    async reserveStock(product, variant, vendor, quantity) {
        return await Inventory.findOneAndUpdate(
            { product, variant, vendor, stock: { $gte: quantity } },
            { $inc: { stock: -quantity, reserved: quantity }, $set: { updatedAt: new Date() } },
            { new: true }
        );
    }

    async releaseReserved(product, variant, vendor, quantity) {
        return await Inventory.findOneAndUpdate(
            { product, variant, vendor, reserved: { $gte: quantity } },
            { $inc: { stock: quantity, reserved: -quantity }, $set: { updatedAt: new Date() } },
            { new: true }
        );
    }

    async deductReserved(product, variant, vendor, quantity) {
        return await Inventory.findOneAndUpdate(
            { product, variant, vendor, reserved: { $gte: quantity } },
            { $inc: { reserved: -quantity }, $set: { updatedAt: new Date() } },
            { new: true }
        );
    }
}

export default InventoryRepository;