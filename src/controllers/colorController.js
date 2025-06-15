import ColorService from '../services/colorService.js';

const colorService = new ColorService();

export const createColor = async (req, res) => {
    try {
        const color = await colorService.createColor({ ...req.body, createdBy: req.user._id });
        res.status(201).json(color);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllColors = async (req, res) => {
    try {
        const colors = await colorService.getAllColors();
        res.json(colors);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getColorById = async (req, res) => {
    try {
        const color = await colorService.getColorById(req.params.id);
        if (!color) {
            return res.status(404).json({ message: 'Color not found' });
        }
        res.json(color);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateColor = async (req, res) => {
    try {
        const color = await colorService.updateColor(req.params.id, req.body);
        res.json(color);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteColor = async (req, res) => {
    try {
        await colorService.deleteColor(req.params.id);
        res.json({ message: 'Color deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};