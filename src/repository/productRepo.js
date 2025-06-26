import Product from '../models/product.js';

class ProductRepository {
    async createProduct(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async getProductById(productId) {
        return await Product.findById(productId);
    }

    async getAllProducts(filter = {}, page = 1, limit = 10) {
        const skip = (page -1) * limit;
        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('vendor', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(filter)
        ]);
        return {
            products,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
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