import categoryService from '../services/categoryService.js';

class CategoryController {
    async create(req, res) {
        try {
            const category = await categoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async getAll(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json(categories);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getById(req, res) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json(category);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const category = await categoryService.updateCategory(req.params.id, req.body);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json(category);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async delete(req, res) {
        try {
            const category = await categoryService.deleteCategory(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({ message: 'Category deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

const categoryController = new CategoryController();
export default categoryController;