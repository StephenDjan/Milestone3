import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import { SendMail } from '../SendMail.js'; // Ensure the correct import path for SendMail

const router = express.Router();

// Create a connection pool using environment variables
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Endpoint for fetching dashboard data
router.get('/dashboard-data', async (req, res) => {
  try {
    const [totalStudents] = await db.query('SELECT COUNT(*) AS total FROM users WHERE role = "student"');
    const [pendingEntries] = await db.query('SELECT COUNT(*) AS total FROM AdvisingRecords WHERE status = "pending"');
    const [totalCourses] = await db.query('SELECT COUNT(*) AS total FROM courses');

    res.json({
      totalStudents: totalStudents[0].total,
      pendingEntries: pendingEntries[0].total,
      totalCourses: totalCourses[0].total,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

// Endpoint for fetching courses
router.get('/courses', async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT * FROM courses 
      WHERE courseLevel BETWEEN 100 AND 499 
      AND isPrerequisite = true
    `);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

// Endpoint to update courses
router.post('/update-courses', async (req, res) => {
  const enabledCourses = req.body.courses;

  if (!Array.isArray(enabledCourses) || enabledCourses.length === 0) {
    return res.status(400).send('No courses provided');
  }

  const values = enabledCourses.map(course => [
    course.courseId, 
    course.courseLevel, 
    course.courseCode, 
    course.courseName
  ]);

  try {
    const query = `
      INSERT INTO prereqs (courseId, courseLevel, courseCode, courseName)
      VALUES ?
    `;
    await db.query(query, [values]);
    res.status(200).send('Courses updated successfully');
  } catch (error) {
    console.error('Error inserting/updating courses:', error);
    res.status(500).send('Failed to update courses');
  }
});

// Fetch Pending Advising Entries
router.get('/pending-entries', async (req, res) => {
  try {
    const [entries] = await db.query(`
      SELECT advisingId, userId, lastTerm, lastGPA, currentTerm, status, rejectionReason, studentName, date
      FROM AdvisingRecords
    `);
    res.json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching pending entries:', error);
    res.status(500).json({ success: false, message: 'Error fetching pending entries.' });
  }
});

// API for Fetching Specific Student Record by Advising ID
router.get('/student/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [student] = await db.query(`
      SELECT * 
      FROM AdvisingRecords 
      WHERE advisingID = ?`, [id]);

    if (!student.length) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    res.status(200).json({ success: true, student: student[0] });
  } catch (error) {
    console.error('Error fetching student record:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student record' });
  }
});

// Approve/Reject Record with Email Notification
router.post('/student/:id/approval', async (req, res) => {
  const { id } = req.params; // advisingId
  const { status, comment } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  try {
    // Update the advising record
    const [result] = await db.query(`
      UPDATE AdvisingRecords 
      SET status = ?, rejectionReason = ? 
      WHERE advisingId = ?`, [status, comment, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    // Fetch userId associated with the advising record
    const [advisingRecord] = await db.query(`SELECT userId FROM AdvisingRecords WHERE advisingId = ?`, [id]);
    if (!advisingRecord.length) {
      return res.status(404).json({ success: false, message: 'Advising record not found.' });
    }
    const userId = advisingRecord[0].userId;

    // Fetch the user's email
    const [student] = await db.query(`SELECT email FROM Users WHERE id = ?`, [userId]);
    if (student.length) {
      const email = student[0].email;
      const emailSubject = `Your Advising Record Has Been ${status.toUpperCase()}`;
      const emailBody = comment || `Your advising record has been ${status}.`;
      SendMail(email, emailSubject, emailBody);
    }

    res.status(200).json({ success: true, message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating student record:', error);
    res.status(500).json({ success: false, message: 'Failed to update student record' });
  }
});

export default router;