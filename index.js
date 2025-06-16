import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/utils/db.js';
import userRoutes from './src/routes/userRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import subcategoryRoutes from './src/routes/subcategoryRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import colorRoutes from './src/routes/colorRoutes.js';
import sizeRoutes from './src/routes/sizeRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';

dotenv.config();
await connectDB();

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories',subcategoryRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/sizes', sizeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => res.send('multi-vendor-Ecommerece backend practice'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));