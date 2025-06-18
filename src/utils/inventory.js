import Product from '../models/product.js';

export async function updateProductVariantStock(productId, variantId, newStock) {
    await Product.updateOne(
        { _id: productId, "variants._id": variantId },
        { $set: { "variants.$.stock": newStock } }
    );
}