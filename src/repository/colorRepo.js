import Color from '../models/color.js';

class ColorRepository {
    async createColor(data) {
        return await Color.create(data);
    }

    async getAllColors() {
        return await Color.find();
    }

    async getColorById(id) {
        return await Color.findById(id);
    }

    async updateColor(id, data) {
        return await Color.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteColor(id) {
        return await Color.findByIdAndDelete(id);
    }
}

export default ColorRepository;