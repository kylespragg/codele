import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [challenges, setChallenges] = useState([]);
    const [newChallenge, setNewChallenge] = useState({ prompt: '', expectedOutput: '', testCase: '', hints: [] });

    useEffect(() => {
        // Fetch existing challenges
        const fetchChallenges = async () => {
            const response = await fetch('/api/challenges');
            const data = await response.json();
            setChallenges(data);
        };
        fetchChallenges();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('/api/admin/challenges', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newChallenge),
        });
        // Optionally refresh the list of challenges
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Prompt" onChange={(e) => setNewChallenge({ ...newChallenge, prompt: e.target.value })} />
                <input type="text" placeholder="Expected Output" onChange={(e) => setNewChallenge({ ...newChallenge, expectedOutput: e.target.value })} />
                <input type="text" placeholder="Test Case" onChange={(e) => setNewChallenge({ ...newChallenge, testCase: e.target.value })} />
                <textarea placeholder="Hints" onChange={(e) => setNewChallenge({ ...newChallenge, hints: e.target.value.split(',') })} />
                <button type="submit">Add Challenge</button>
            </form>
            <ul>
                {challenges.map(challenge => (
                    <li key={challenge.id}>{challenge.prompt}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard; 