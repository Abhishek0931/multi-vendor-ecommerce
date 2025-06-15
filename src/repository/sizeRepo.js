import Size from '../models/size.js';

class SizeRepository {
    async createSize(data) {
        return await Size.create(data);
    }

    async getAllSizes() {
        return await Size.find();
    }

    async getSizeById(id) {
        return await Size.findById(id);
    }

    async updateSize(id, data) {
        return await Size.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteSize(id) {
        return await Size.findByIdAndDelete(id);
    }
}

export default SizeRepository;