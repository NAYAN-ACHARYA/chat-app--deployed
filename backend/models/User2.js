import mongoose from 'mongoose';

const user2Schema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default mongoose.model('User2', user2Schema);
