import subcategoryService from '../services/subcategoryService.js';

class SubcategoryController {
    async create(req, res) {
        try {
            const subcategory = await subcategoryService.createSubcategory(req.body);
            res.status(201).json(subcategory);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async getAll(req, res) {
        try {
            const subcategories = await subcategoryService.getAllSubcategories();
            res.json(subcategories);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getById(req, res) {
        try {
            const subcategory = await subcategoryService.getSubcategoryById(req.params.id);
            if (!subcategory) {
                return res.status(404).json({ message: 'Subcategory not found' });
            }
            res.json(subcategory);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const subcategory = await subcategoryService.updateSubcategory(req.params.id, req.body);
            if (!subcategory) {
                return res.status(404).json({ message: 'Subcategory not found' });
            }
            res.json(subcategory);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async delete(req, res) {
        try {
            const subcategory = await subcategoryService.deleteSubcategory(req.params.id);
            if (!subcategory) {
                return res.status(404).json({ message: 'Subcategory not found' });
            }
            res.json({ message: 'Subcategory deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

const subcategoryController = new SubcategoryController();
export default subcategoryController;