import InventoryService from '../services/inventoryService.js';

const inventoryService = new InventoryService();

export const getInventory = async (req, res) => {
    try {
        const { product, variant, vendor } = req.query;
        const inv = await inventoryService.getInventory(product, variant, vendor);
        if (!inv) return res.status(404).json({ message: 'Inventory not found' });
        res.json(inv);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateStock = async (req, res) => {
    try {
        const { product, variant, vendor, stock } = req.body;
        const inv = await inventoryService.updateStock(product, variant, vendor, stock);
        res.json(inv);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllInventoryByVendor = async (req, res) => {
    try {
        let vendorId;
        if (req.user.role === 'admin') {
            vendorId = req.query.vendorId; // Admin can specify any vendor
            if (!vendorId) return res.status(400).json({ message: 'vendorId is required for admin' });
        } else {
            vendorId = req.user._id; // Vendor sees their own inventory
        }
        const inv = await inventoryService.getAllInventoryByVendor(vendorId);
        res.json(inv);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllInventory = async (req, res) => {
    try {
        const inv = await inventoryService.getAllInventory();
        res.json(inv);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};