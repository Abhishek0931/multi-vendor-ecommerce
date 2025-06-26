import ProductRepository from '../repository/productRepo.js';

const productRepo = new ProductRepository();

class ProductService {
    async createProduct(productData) {
        return await productRepo.createProduct(productData);
    }

    async getProductById(productId) {
        return await productRepo.getProductById(productId);
    }

    async getAllProducts(filter, page, limit) {
        return await productRepo.getAllProducts(filter, page, limit);
    }

    async updateProduct(productId, updateData, user) {
        const product = await productRepo.getProductById(productId);
        if (!product) throw new Error('Product not found');
        // Only vendor who owns the product or admin can update
        if (user.role !== 'admin' && String(product.vendor) !== String(user._id)) {
            throw new Error('Unauthorized');
        }
        return await productRepo.updateProduct(productId, updateData);
    }

    async deleteProduct(productId, user) {
        const product = await productRepo.getProductById(productId);
        if (!product) throw new Error('Product not found');
        if (user.role !== 'admin' && String(product.vendor) !== String(user._id)) {
            throw new Error('Unauthorized');
        }
        return await productRepo.deleteProduct(productId);
    }

    async getVendorProducts(vendorId) {
        return await productRepo.getVendorProducts(vendorId);
    }

    async approveProduct(productId) {
        return await productRepo.updateProduct(productId, { isApproved: true });
    }

    async rejectProduct(productId) {
        return await productRepo.updateProduct(productId, { isApproved: false });
    }
}

export default ProductService;