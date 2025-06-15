import Category from '../models/category.js';

const createCategory = async (data) => Category.create(data);

const getAllCategories = async () => Category.find();

const getCategoryById = async (id) => Category.findById(id);

const getCategoryByName = async (name) => Category.findOne({ name });

const updateCategory = async (id, data) =>
    Category.findByIdAndUpdate(id, data, { new: true });

const deleteCategory = async (id) => Category.findByIdAndDelete(id);

export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    getCategoryByName,
    updateCategory,
    deleteCategory,
};