const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed passwords
    role: { type: String, enum: ['user', 'admin'], default: 'user' } // Role field
});

module.exports = mongoose.model('User', userSchema);