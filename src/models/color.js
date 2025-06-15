import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    hex: { type: String }, // Optional: store hex code for UI
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional: track who created
}, { timestamps: true });

export default mongoose.model('Color', colorSchema);