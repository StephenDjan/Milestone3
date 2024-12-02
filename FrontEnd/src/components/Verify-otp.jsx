import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './providers/UserContext';


const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, setUserInfo, userEmail, setuserEmail } = useContext(UserContext);
  const email = location.state?.email || userEmail; // Get the email from state

  const [otpCode, setOtpCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is missing. Please register again.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otpCode });
      setMessage(response.data.message);
      setError('');

      // Redirect to profile page or another protected route after successful OTP verification
      navigate('/profile'); // Adjust this path as necessary
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying OTP');
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Verify OTP</h1>
      <form onSubmit={handleVerifyOtp}>
        <label>
          Enter OTP:
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            required
          />
        </label>
        <button type="submit">Verify</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VerifyOTP;