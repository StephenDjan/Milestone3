import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [phone, setPhone] = useState('');  // Initialize phone from localStorage
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get the phone number from localStorage
    const storedPhone = localStorage.getItem('verifiedPhone');
    if (storedPhone) {
      setPhone(storedPhone); // Set phone from localStorage
    } else {
      // If no phone is found, redirect to forgot-password page
      navigate('/forgot-password');
    }
  }, [navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', { phone, password });
      setMessage(response.data.message);
      setError('');
      navigate('/');  // Redirect to login after success
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      setMessage('');
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleResetPassword}>
        <h2>Set New Password</h2>
        
        {/* Input for new password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          required
        />

        {/* Input for confirm password */}
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        
        <button type="submit">Reset Password</button>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
