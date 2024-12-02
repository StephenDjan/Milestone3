import express from 'express';
import mysql from 'mysql2';
import { HashedPassword } from '../helper.js'; // Import your helper function

const router = express.Router();
const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'StevDB' });

// Forgot Password - Verify Phone
router.post('/forgot-password', (req, res) => {
  const { phone } = req.body;
  db.query('SELECT * FROM Users WHERE phone = ?', [phone], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Phone number not found' });
    }
    res.status(200).json({ message: 'Phone number verified, you can reset your password now.' });
  });
});

// Reset Password - Update Password
router.post('/reset-password', async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Hash the new password using the helper function
    const hashedPassword = HashedPassword(password);

    db.query('UPDATE Users SET password = ? WHERE phone = ?', [hashedPassword, phone], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating password' });
      }
      res.status(200).json({ message: 'Password updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error hashing password' });
  }
});

export default router;
