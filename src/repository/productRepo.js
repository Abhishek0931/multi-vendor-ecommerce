import Product from '../models/product.js';

class ProductRepository {
    async createProduct(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async getProductById(productId) {
        return await Product.findById(productId);
    }

    async getAllProducts(filter = {}) {
        return await Product.find(filter).populate('vendor', 'name email');
    }

    async updateProduct(productId, updateData) {
        return await Product.findByIdAndUpdate(productId, updateData, { new: true });
    }

    async deleteProduct(productId) {
        return await Product.findByIdAndDelete(productId);
    }

    async getVendorProducts(vendorId) {
        return await Product.find({ vendor: vendorId });
    }
}

export default ProductRepository;