import SizeRepository from '../repository/sizeRepo.js';

const sizeRepo = new SizeRepository();

class SizeService {
    async createSize(data) {
        return await sizeRepo.createSize(data);
    }

    async getAllSizes() {
        return await sizeRepo.getAllSizes();
    }

    async getSizeById(id) {
        return await sizeRepo.getSizeById(id);
    }

    async updateSize(id, data) {
        return await sizeRepo.updateSize(id, data);
    }

    async deleteSize(id) {
        return await sizeRepo.deleteSize(id);
    }
}

export default SizeService;