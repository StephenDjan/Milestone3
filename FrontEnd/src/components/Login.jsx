import React, { useContext, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "./providers/UserContext";
import ReCAPTCHA from "react-google-recaptcha";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const { setUserInfo, setuserEmail } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!captchaVerified) {
      setError("Please complete the reCAPTCHA.");
      setLoading(false);
      return;
    }

    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      const user = response.data.user;

      // Save user info in context
      setUserInfo(user);
      setuserEmail(email);

      // Redirect to OTP verification for all users
      navigate("/verify-otp");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = () => {
    const token = recaptchaRef.current.getValue();
    if (token) {
      setCaptchaVerified(true);
    } else {
      setCaptchaVerified(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
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

        {/* reCAPTCHA Component */}
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_SITE_KEY}
          onChange={handleCaptchaChange}
          ref={recaptchaRef}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="login-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/registration">Don't have an account? Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
