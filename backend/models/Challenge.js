const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    prompt: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    testCase: { type: String, required: true },
    hints: { type: [String], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to the user who created the challenge
});

module.exports = mongoose.model('Challenge', challengeSchema);