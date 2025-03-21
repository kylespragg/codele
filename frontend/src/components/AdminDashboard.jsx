import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [challenges, setChallenges] = useState([]);
    const [newChallenge, setNewChallenge] = useState({
        prompt: '',
        expectedOutput: '',
        testCase: '',
        hints: [''],
        solutions: {
            javascript: '',
            python: ''
        }
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [newAdmin, setNewAdmin] = useState({ username: '', password: '', email: '' });
    const [adminError, setAdminError] = useState('');
    const [adminSuccess, setAdminSuccess] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const challengesPerPage = 5; // Number of challenges per page

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        try {
            const response = await fetch('/api/challenges');
            if (!response.ok) throw new Error('Failed to fetch challenges');
            const data = await response.json();
            setChallenges(data);
        } catch (error) {
            setError('Error fetching challenges: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/challenges', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newChallenge),
            });

            if (!response.ok) throw new Error('Failed to create challenge');
            
            // Reset form
            setNewChallenge({
                prompt: '',
                expectedOutput: '',
                testCase: '',
                hints: [''],
                solutions: {
                    javascript: '',
                    python: ''
                }
            });
            
            // Refresh challenges list
            fetchChallenges();
        } catch (error) {
            setError('Error creating challenge: ' + error.message);
        }
    };
    const addHint = () => {
        if (newChallenge.hints.length < 5) {
            setNewChallenge({
                ...newChallenge,
                hints: [...newChallenge.hints, '']
            });
        }
    };

    const handleHintChange = (index, value) => {
        const newHints = [...newChallenge.hints];
        newHints[index] = value;
        setNewChallenge({ ...newChallenge, hints: newHints });
    };
    
    const removeHint = (indexToRemove) => {
        if (newChallenge.hints.length > 1) {
            setNewChallenge({
                ...newChallenge,
                hints: newChallenge.hints.filter((_, index) => index !== indexToRemove)
            });
        }
    };

    // Pagination logic
    const indexOfLastChallenge = currentPage * challengesPerPage;
    const indexOfFirstChallenge = indexOfLastChallenge - challengesPerPage;
    const currentChallenges = challenges.slice(indexOfFirstChallenge, indexOfLastChallenge);
    const totalPages = Math.ceil(challenges.length / challengesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Function to get the range of page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxButtons = 5; // Maximum number of buttons to display
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        // Adjust startPage if endPage is less than maxButtons
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setAdminError('');
        setAdminSuccess('');
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...newAdmin,
                    role: 'admin'
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setAdminSuccess('Admin created successfully!');
                setNewAdmin({ username: '', password: '' }); // Reset form
            } else {
                setAdminError(data.message || 'Failed to create admin');
            }
        } catch (error) {
            setAdminError('Error creating admin: ' + error.message);
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            {error && <div className="error-message">{error}</div>}
            
            <div className="challenge-form">
                <h2>Create New Challenge</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Challenge Prompt:</label>
                        <textarea
                            value={newChallenge.prompt}
                            onChange={(e) => setNewChallenge({ ...newChallenge, prompt: e.target.value })}
                            placeholder="Write your challenge prompt here..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Expected Output:</label>
                        <input
                            type="text"
                            value={newChallenge.expectedOutput}
                            onChange={(e) => setNewChallenge({ ...newChallenge, expectedOutput: e.target.value })}
                            placeholder="Expected output for the test case"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Test Case:</label>
                        <input
                            type="text"
                            value={newChallenge.testCase}
                            onChange={(e) => setNewChallenge({ ...newChallenge, testCase: e.target.value })}
                            placeholder="Test case input (e.g., [1, -4, 7, -2])"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Hints:</label>
                        <div className="hints-container">
                            {newChallenge.hints.map((hint, index) => (
                                <div key={index} className="hint-input-group">
                                    <span className="hint-number">{index + 1}.</span>
                                    <input
                                        type="text"
                                        value={hint}
                                        onChange={(e) => handleHintChange(index, e.target.value)}
                                        placeholder={`Enter hint ${index + 1}`}
                                    />
                                    {newChallenge.hints.length > 1 && (
                                        <button 
                                            type="button"
                                            onClick={() => removeHint(index)}
                                            className="remove-hint-button"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                            {newChallenge.hints.length < 5 && (
                                <button 
                                    type="button" 
                                    onClick={addHint}
                                    className="add-hint-button"
                                >
                                    + Add Hint
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Solutions:</label>
                        <div className="solutions-container">
                            <div className="language-solution">
                                <h3>JavaScript Solution:</h3>
                                <textarea
                                    value={newChallenge.solutions.javascript}
                                    onChange={(e) => setNewChallenge({
                                        ...newChallenge,
                                        solutions: {
                                            ...newChallenge.solutions,
                                            javascript: e.target.value
                                        }
                                    })}
                                    placeholder="Write JavaScript solution here..."
                                    className="code-input javascript"
                                />
                            </div>
                            <div className="language-solution">
                                <h3>Python Solution:</h3>
                                <textarea
                                    value={newChallenge.solutions.python}
                                    onChange={(e) => setNewChallenge({
                                        ...newChallenge,
                                        solutions: {
                                            ...newChallenge.solutions,
                                            python: e.target.value
                                        }
                                    })}
                                    placeholder="Write Python solution here..."
                                    className="code-input python"
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="submit-button">
                        Create Challenge
                    </button>
                </form>
            </div>

            <div className="challenges-list">
                <h2>Existing Challenges</h2>
                {isLoading ? (
                    <p>Loading challenges...</p>
                ) : currentChallenges.length === 0 ? (
                    <p>No challenges yet</p>
                ) : (
                    <ul>
                        {currentChallenges.map(challenge => (
                            <li key={challenge._id}>
                                <h3>{challenge.prompt}</h3>
                                <p><strong>Test Case:</strong> {challenge.testCase}</p>
                                <p><strong>Expected Output:</strong> {challenge.expectedOutput}</p>
                                <p><strong>Hints:</strong> {challenge.hints.length}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                {currentPage > 1 && (
                    <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                )}
                {getPageNumbers().map((number) => (
                    <button 
                        key={number} 
                        onClick={() => handlePageChange(number)} 
                        className={currentPage === number ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}
                {currentPage < totalPages && (
                    <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                )}
            </div>

            <div className="admin-creation">
                <h2>Create New Admin</h2>
                {adminError && <div className="error-message">{adminError}</div>}
                {adminSuccess && <div className="success-message">{adminSuccess}</div>}
                
                <form onSubmit={handleCreateAdmin} className="admin-form">
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            value={newAdmin.username}
                            onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                            placeholder="Enter admin username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={newAdmin.password}
                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                            placeholder="Enter admin password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                            placeholder="Enter admin email"
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Create Admin
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;