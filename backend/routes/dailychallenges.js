const express = require('express');
const Challenge = require('../models/Challenge');
const { authenticate, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Create a new challenge (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
    const { prompt, expectedOutput, testCase, hints } = req.body;
    const challenge = new Challenge({
        prompt,
        expectedOutput,
        testCase,
        hints,
        createdBy: req.user.id // Associate the challenge with the user who created it
    });

    try {
        await challenge.save();
        res.status(201).json(challenge);
    } catch (error) {
        res.status(400).send('Error creating challenge: ' + error.message);
    }
});

// Get all challenges
router.get('/', async (req, res) => {
    const challenges = await Challenge.find().populate('createdBy', 'username'); // Populate createdBy field
    res.json(challenges);
});

module.exports = router;