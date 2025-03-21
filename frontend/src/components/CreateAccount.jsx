import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/CreateAccount.css'; // Import the CSS file

const CreateAccount = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Account created successfully! You can now log in.');
                setUsername('');
                setPassword('');
                setEmail('');
            } else {
                setError(data.message || 'Failed to create account');
            }
        } catch (error) {
            setError('An error occurred while creating the account');
        }
    };

    return (
        <div className="form-container">
            <h2>Create Account</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleCreateAccount}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Create Account</button>
            </form>
            <button className="back-button" onClick={() => navigate('/')}>Back to Main</button> {/* Back button */}
        </div>
    );
};

export default CreateAccount;