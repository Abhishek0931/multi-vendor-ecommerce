import categoryRepo from '../repository/categoryRepo.js';

class CategoryService {
    async createCategory(data) {
        const existingCategory = await categoryRepo.getCategoryByName(data.name);
        if (existingCategory) {
            throw new Error('Category already exists');
        }
        return categoryRepo.createCategory(data);
    }

    async getAllCategories() {
        return categoryRepo.getAllCategories();
    }

    async getCategoryById(id) {
        return categoryRepo.getCategoryById(id);
    }

    async updateCategory(id, data) {
        return categoryRepo.updateCategory(id, data);
    }

    async deleteCategory(id) {
        return categoryRepo.deleteCategory(id);
    }
}

export default new CategoryService();