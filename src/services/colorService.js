import ColorRepository from '../repository/colorRepo.js';

const colorRepo = new ColorRepository();

class ColorService {
    async createColor(data) {
        return await colorRepo.createColor(data);
    }

    async getAllColors() {
        return await colorRepo.getAllColors();
    }

    async getColorById(id) {
        return await colorRepo.getColorById(id);
    }

    async updateColor(id, data) {
        return await colorRepo.updateColor(id, data);
    }

    async deleteColor(id) {
        return await colorRepo.deleteColor(id);
    }
}

export default ColorService;