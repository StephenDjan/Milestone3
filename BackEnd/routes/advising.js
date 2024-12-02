import express from 'express';
import db from '../controllers/config/db.js'; // Adjust path based on your setup

const router = express.Router();

// Fetch advising history for a student
router.get('/history', (req, res) => {
  const email = req.query.email; // Assume student ID is passed as a query param

  console.log(email)
  const query = `SELECT lastTerm, status, date FROM AdvisingRecords WHERE email = ? ORDER BY date DESC`;
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (result.length === 0) {
      return res.status(200).json({ records: [], message: 'No Records' });
    }
    res.status(200).json({ records: result });
  });
});

export default router;
