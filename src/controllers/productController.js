import ProductService from '../services/productService.js';

const productService = new ProductService();

export const createProduct = async (req, res) => {
    try {
        const productData = { ...req.body, vendor: req.user._id };
        const variants = Array.isArray(req.body.variants) ? req.body.variants : [];

        // Attach images to each variant by index
        variants.forEach((variant, idx) => {
            const images = req.files
                .filter(file => file.fieldname === `variants[${idx}][images]`)
                .map(file => file.path);
            variant.images = images;
        });

        productData.variants = variants;
        const product = await productService.createProduct(productData);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        // Only show approved products to buyers
        let filter = {};
        if (req.user?.role === 'buyer' || !req.user) filter.isApproved = true;
        res.json(await productService.getAllProducts(filter));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body };
        let variants = [];

        // If variants is already an array (from form-data or JSON)
        if (Array.isArray(req.body.variants)) {
            variants = req.body.variants;
            // Attach images to each variant by index
            variants.forEach((variant, idx) => {
                const images = req.files
                    .filter(file => file.fieldname === `variants[${idx}][images]`)
                    .map(file => file.path);
                variant.images = images;
            });
        } else {
            // Fallback: parse flat keys (if needed)
            const variantIndexes = Object.keys(req.body)
                .map(key => {
                    const match = key.match(/^variants\[(\d+)\]\[([^\]]+)\]$/);
                    return match ? parseInt(match[1], 10) : null;
                })
                .filter(idx => idx !== null);
            const uniqueIndexes = [...new Set(variantIndexes)];

            uniqueIndexes.forEach(idx => {
                const color = req.body[`variants[${idx}][color]`];
                const size = req.body[`variants[${idx}][size]`];
                const price = req.body[`variants[${idx}][price]`];
                const quantity = req.body[`variants[${idx}][quantity]`];
                const images = req.files
                    .filter(file => file.fieldname === `variants[${idx}][images]`)
                    .map(file => file.path);

                variants.push({
                    color,
                    size,
                    price,
                    quantity,
                    images
                });
            });
        }

        if (variants.length > 0) {
            updateData.variants = variants;
        }

        const product = await productService.updateProduct(req.params.id, updateData, req.user);
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id, req.user);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getVendorProducts = async (req, res) => {
    try {
        const products = await productService.getVendorProducts(req.user._id);
        res.json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const approveProduct = async (req, res) => {
    try {
        const product = await productService.approveProduct(req.params.id);
        res.json({ message: 'Product Approved', product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const rejectProduct = async (req, res) => {
    try {
        const product = await productService.rejectProduct(req.params.id);
        res.json({ message: 'Product Rejected', product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};