import InventoryRepository from '../repository/inventoryRepo.js';
import Product from '../models/product.js';
import { updateProductVariantStock } from '../utils/inventory.js';

const inventoryRepo = new InventoryRepository();

class InventoryService {
    async getInventory(product, variant, vendor) {
        return await inventoryRepo.getInventory(product, variant, vendor);
    }

    async getAllInventory() {
        return await inventoryRepo.getAllInventory();
    }

    async getAllInventoryByVendor(vendor) {
        return await inventoryRepo.getAllInventoryByVendor(vendor);
    }

    async updateStock(product, variant, vendor, stock) {
        const inv = await inventoryRepo.updateStock(product, variant, vendor, stock);
        if (inv) {
            await updateProductVariantStock(product, variant, inv.stock);
        }
        return inv;
    }

    async reserveStock(product, variant, vendor, quantity) {
        const inv = await inventoryRepo.reserveStock(product, variant, vendor, quantity);
        if (!inv) throw new Error('Insufficient stock');
        // sync product variant stock
        await updateProductVariantStock(product, variant, inv.stock);
        return inv;
    }

    async releaseReserved(product, variant, vendor, quantity) {
        const inv = await inventoryRepo.releaseReserved(product, variant, vendor, quantity);
        if (inv) {
            await updateProductVariantStock(product, variant, inv.stock);
        }
        return inv;
    }

    async deductReserved(product, variant, vendor, quantity) {
        const inv = await inventoryRepo.deductReserved(product, variant, vendor, quantity);
        if (inv) {
            await updateProductVariantStock(product, variant, inv.stock);
        }
        return inv;
    }
}

export default InventoryService;