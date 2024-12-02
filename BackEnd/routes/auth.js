import express from 'express';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2';
import { SendMail } from "../SendMail.js";

const router = express.Router();

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'StevDB'
});

// Registration endpoint
router.post('/register', async (req, res) => {
  const { username, email, password, phone, city } = req.body;
  const admin = 0; // Regular user, not an admin
  const is_verified = 0; // User is not verified until OTP is confirmed

  try {
    // Check if user already exists
    db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const otp = Math.floor(Math.random() * (999999)) + 1;
      const otpCreatedAt = new Date();

      // Send verification email
      SendMail(email, "OTP Verification", otp);

      // Insert the user into the database with is_verified = 0
      db.query(
        'INSERT INTO Users (email, password, username, phone, city, admin, otp, otp_created_at, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, username, phone, city, admin, otp, otpCreatedAt, is_verified],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Database error during registration' });
          }
          return res.status(201).json({ message: 'User registered. Please verify your OTP to complete registration.', email });
        }
      );
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin login endpoint
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result[0];

    // Check if the user is an admin
    if (user.admin !== 1) {
      return res.status(403).json({ message: 'Access denied. You are not an admin.' });
    }

    // Compare the entered password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Admin login successful
    res.status(200).json({ message: 'Admin login successful', user });
  });
});

// Endpoint to fetch all user emails (admin-only route)
router.get('/admin/users', (req, res) => {
  db.query('SELECT email FROM Users', (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    return res.status(200).json({ users: result });
  });
});

export default router;
