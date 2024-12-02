import express from 'express';
import mysql from 'mysql2';

const router = express.Router();

// Create a database connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
  console.log('Connected to the MySQL database.');
});

// Endpoint to create advising entry
router.post('/entry', async (req, res) => {
  const { lastTerm, lastGPA, currentTerm, prerequisites, coursePlan, userId, studentName, date } = req.body;
  console.log("prerequisites")
  console.log(prerequisites)
  console.log("coursePlan")
  console.log(coursePlan)

  const coursePlanString = coursePlan.map(item => item.course).join(' ');
  const preReqPlanString = prerequisites.map(item => item.course).join(' ');
  console.log("coursePlanString")
  console.log(coursePlanString)
  console.log("preReqPlanString")
  console.log(preReqPlanString)

  // Validate data
  if (!userId || !lastTerm || !lastGPA || !currentTerm || !studentName || !date) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
      // Insert main advising entry
      const [result] = await db.promise().query(
          'INSERT INTO AdvisingRecords (userId, lastTerm, lastGPA, currentTerm, status, rejectionReason, studentName, date, courseplan, prereqplan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [userId, lastTerm, lastGPA, currentTerm, 'pending', '', studentName, date, coursePlanString, preReqPlanString]
      );
      const advisingId = result.insertId;

     
      
      res.status(201).json({ success: true, message: 'Advising entry created successfully.' });
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: error });
  }
});


// Endpoint to fetch advising history for a student
router.get('/advising-history', (req, res) => {
  const { id } = req.query;

  const query = `
    SELECT lastTerm, status, date
    FROM AdvisingRecords
    WHERE userId = ?
    ORDER BY date DESC
  `;
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Error fetching history' });
    }
    res.status(200).json({ records: results });
  });
});

// Endpoint to fetch all courses
router.get('/courses', (req, res) => {
  const query = 'SELECT courseId, courseName, courseCode, courseLevel, isPrerequisite FROM Courses';
  
  db.query(query, (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Error fetching courses' });
    }
    res.status(200).json(results); // Send the results as a JSON response
  });
});

// Endpoint to fetch all courses
router.get('/get_courses', (req, res) => {
  const query = 'SELECT courseId, courseName, courseCode FROM Courses';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Error fetching courses' });
    }
    res.status(200).json(results);
  });
});

export default router;
