import Subcategory from '../models/subcategory.js';

const createSubcategory = async (data) => Subcategory.create(data);

const getAllSubcategories = async () => Subcategory.find().populate('category');

const getSubcategoryById = async (id) => Subcategory.findById(id).populate('category');

const getSubcategoryByNameAndCategory = async (name, categoryId) =>
    Subcategory.findOne({ name, category: categoryId });

const updateSubcategory = async (id, data) =>
    Subcategory.findByIdAndUpdate(id, data, { new: true });

const deleteSubcategory = async (id) => Subcategory.findByIdAndDelete(id);

export default {
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    getSubcategoryByNameAndCategory,
    updateSubcategory,
    deleteSubcategory,
};