import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import {
    getInventory,
    updateStock,
    getAllInventoryByVendor,
    getAllInventory
} from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', authenticate, authorizeRoles('admin'), getAllInventory); // gets all inventory records
router.get('/vendor', authenticate, authorizeRoles('vendor', 'admin'), getAllInventoryByVendor); // gets all inventory of a specific vendor, can be accessed by admin and vendor
/* 
Vendor:
GET /api/inventory/vendor (no params needed)
Admin:
GET /api/inventory/vendor?vendorId=<vendorId>
*/

router.get('/single', authenticate, getInventory); // gets a inventory of specific vendor's specific product's variant
// GET /api/inventory/single?product=<productId>&variant=<variantId>&vendor=<vendorId>

router.post('/update', authenticate, authorizeRoles('vendor', 'admin'), updateStock);


export default router;