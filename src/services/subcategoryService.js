import subcategoryRepo from '../repository/subcategoryRepo.js';

class SubcategoryService {
    async createSubcategory(data) {
        const existing = await subcategoryRepo.getSubcategoryByNameAndCategory(data.name, data.category);
        if (existing) {
            throw new Error('Subcategory already exists in this category');
        }
        return subcategoryRepo.createSubcategory(data);
    }

    async getAllSubcategories() {
        return subcategoryRepo.getAllSubcategories();
    }

    async getSubcategoryById(id) {
        return subcategoryRepo.getSubcategoryById(id);
    }

    async updateSubcategory(id, data) {
        return subcategoryRepo.updateSubcategory(id, data);
    }

    async deleteSubcategory(id) {
        return subcategoryRepo.deleteSubcategory(id);
    }
}

export default new SubcategoryService();