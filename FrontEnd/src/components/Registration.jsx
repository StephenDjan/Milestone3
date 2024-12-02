import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./registration.css";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState(""); // For password-specific error
  const navigate = useNavigate();

  // Function to validate the password
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    // Validate password before proceeding
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character."
      );
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username,
        email,
        password,
        phone,
        city,
      });

      console.log("Registration Success:", response.data.message);
      alert(response.data.message);

      // Navigate to the verify OTP page with email
      navigate("/verify-otp", { state: { email } });
      setError(""); // Clear any previous error
      setPasswordError(""); // Clear password error
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "An error occurred");
      setMessage("");
    }
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <form onSubmit={handleRegistration}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          required
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          required
        />
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registration;
