const express = require('express');
const Challenge = require('../models/Challenge');
const router = express.Router();
const auth = require('./auth');
const { VM } = require('vm2');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// Create a new challenge (admin only)
router.post('/', auth.authenticate, auth.isAdmin, async (req, res) => {
    const { prompt, expectedOutput, testCase, hints, solutions } = req.body;

    const challenge = new Challenge({
        prompt,
        expectedOutput,
        testCase,
        hints,
        solutions, // Store solutions for both JavaScript and Python
        createdBy: req.user.id
    });

    try {
        await challenge.save();
        res.status(201).json(challenge);
    } catch (error) {
        res.status(400).json({ message: 'Error creating challenge: ' + error.message });
    }
});

// Get all challenges
router.get('/', async (req, res) => {
    try {
        const challenges = await Challenge.find()
            .populate('createdBy', 'username')
            .select('-solutions'); // Don't send solutions to frontend by default
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching challenges' });
    }
});

// Get current daily challenge
router.get('/daily', async (req, res) => {
    try {
        const challenge = await Challenge.findOne()
            .sort({ createdAt: -1 })
            .select('-solutions'); // Don't send solutions to frontend
        res.json(challenge);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching daily challenge' });
    }
});

// Check solution endpoint
router.post('/check', async (req, res) => {
    const { code, language, challengeId } = req.body;

    try {
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        const result = await executeCode(code, language, challenge.testCase);
        const success = result.toString() === challenge.expectedOutput;

        res.json({
            success,
            output: result.toString(),
            expected: challenge.expectedOutput
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Execute code based on language
const executeCode = async (code, language, testCase) => {
    switch (language) {
        case 'javascript':
            return await executeJavaScript(code, testCase);
        case 'python':
            return await executePython(code, testCase);
        default:
            throw new Error('Unsupported language');
    }
};

// JavaScript execution
const executeJavaScript = async (code, testCase) => {
    const vm = new VM({
        timeout: 1000, // 1 second timeout
        sandbox: {}
    });

    try {
        const wrappedCode = `
            (function() {
                ${code}
                return solution(${testCase});
            })()
        `;
        return vm.run(wrappedCode);
    } catch (error) {
        throw new Error('JavaScript execution error: ' + error.message);
    }
};

// Python execution
const executePython = async (code, testCase) => {
    const tempDir = path.join(__dirname, '../temp');
    const filename = path.join(tempDir, `temp_${Date.now()}.py`);

    // Create Python code with proper structure and test case
    const pythonCode = `
def solution(test_input):
${code.split('\n').map(line => '    ' + line).join('\n')}

# Run solution with test case
result = solution(${testCase})
print(str(result))
`;

    try {
        // Ensure temp directory exists
        await fs.mkdir(tempDir, { recursive: true });
        
        // Write code to temporary file
        await fs.writeFile(filename, pythonCode);
        
        // Execute Python code
        const result = await new Promise((resolve, reject) => {
            exec(`python3 "${filename}"`, {
                timeout: 5000, // 5 second timeout
                maxBuffer: 1024 * 1024, // 1MB output limit
            }, (error, stdout, stderr) => {
                // Clean up temp file
                fs.unlink(filename).catch(console.error);
                
                if (error) {
                    reject(new Error(stderr || error.message));
                    return;
                }
                resolve(stdout.trim());
            });
        });

        return result;
    } catch (error) {
        // Clean up temp file on error
        await fs.unlink(filename).catch(console.error);
        throw new Error('Python execution error: ' + error.message);
    }
};

// Update challenge (admin only)
router.put('/:id', auth.authenticate, auth.isAdmin, async (req, res) => {
    try {
        const challenge = await Challenge.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(challenge);
    } catch (error) {
        res.status(400).json({ message: 'Error updating challenge' });
    }
});

// Delete challenge (admin only)
router.delete('/:id', auth.authenticate, auth.isAdmin, async (req, res) => {
    try {
        await Challenge.findByIdAndDelete(req.params.id);
        res.json({ message: 'Challenge deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting challenge' });
    }
});

module.exports = router;