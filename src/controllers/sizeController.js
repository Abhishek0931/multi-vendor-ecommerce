import SizeService from '../services/sizeService.js';

const sizeService = new SizeService();

export const createSize = async (req, res) => {
    try {
        const size = await sizeService.createSize({ ...req.body, createdBy: req.user._id });
        res.status(201).json(size);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllSizes = async (req, res) => {
    try {
        const sizes = await sizeService.getAllSizes();
        res.json(sizes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getSizeById = async (req, res) => {
    try {
        const size = await sizeService.getSizeById(req.params.id);
        if (!size) {
            return res.status(404).json({ message: 'Size not found' });
        }
        res.json(size);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateSize = async (req, res) => {
    try {
        const size = await sizeService.updateSize(req.params.id, req.body);
        res.json(size);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSize = async (req, res) => {
    try {
        await sizeService.deleteSize(req.params.id);
        res.json({ message: 'Size deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};