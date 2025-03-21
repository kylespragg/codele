import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/ForgotPassword.css'; // Import the CSS file

const ForgotPassword = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset link sent to your email.');
                setEmail('');
            } else {
                setError(data.message || 'Failed to send reset link');
            }
        } catch (error) {
            setError('An error occurred while sending the reset link');
        }
    };

    return (
        <div className="form-container">
            <h2>Forgot Password</h2>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Send Reset Link</button>
            </form>
            <button className="back-button" onClick={() => navigate('/')}>Back to Main</button> {/* Back button */}
        </div>
    );
};

export default ForgotPassword;