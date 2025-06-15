import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional: track who created
}, { timestamps: true });

export default mongoose.model('Size', sizeSchema);