import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, default: null },
    lastName: { type: String, required: true, default: null },
    email: { type: String, required: true, default: null, unique: true },
    username: { type: String, required: true, default: null, unique: true },
    password: { type: String, required: true, default: null },
    token: { type: String, required: false, default: null },
}, { timestamps: true });

export default mongoose.model('User', userSchema);