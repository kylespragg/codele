const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true
    },
    expectedOutput: {
        type: String,
        required: true
    },
    testCase: {
        type: String,
        required: true
    },
    hints: [{
        type: String
    }],
    solutions: {
        javascript: {
            type: String,
            required: true
        },
        python: {
            type: String,
            default: ''
        },
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);