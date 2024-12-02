import dotenv from 'dotenv';
dotenv.config();
import { SendMail } from './SendMail.js';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import {HashedPassword} from "./helper.js"
import passwordReset from './routes/passwordReset.js';
// Import routes from auth.js
import authRoutes from './routes/auth.js';
//import advisingRoutes from './routes/advising.js';
import advisingRoutes from './routes/advisingRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods if needed
    credentials: true // Allow credentials if you are using cookies or HTTP Auth
}))

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Use your MySQL username
  password: '',  // Use your MySQL password
  database: 'StevDB' // The database we created
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.use("/api", authRoutes)

// Advising History endpoint
app.use('/api/advising', advisingRoutes);

//adminRoutes endpoint
app.use('/admin', adminRoutes);

app.use('/api/admin', adminRoutes);


// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password, phone, city } = req.body;
  const admin = 0;

  // Check if user already exists
  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = HashedPassword(password);
    const gmailtoken = Math.floor(Math.random() * 999999) + 1;
    const otpCreatedAt = new Date();

    // Send verification email
    SendMail(email, "Login Verification", gmailtoken);

    // Insert the user into the database with otp and otp_created_at
    db.query('INSERT INTO Users (email, password, username, phone, city, admin, otp, otp_created_at, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)', 
      [email, hashedPassword, username, phone, city, admin, gmailtoken, otpCreatedAt], (err) => {
        if (err) {
          return res.status(500).json({ message: 'Database error during registration' });
        }
        return res.status(201).json({ message: 'User registered successfully, please verify your OTP' });
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    console.log("Called Post")

  const { email, password } = req.body;
  console.log("email ", email)
  console.log("password ", password)


  // Find the user by email
  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length == 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result[0];

    // Compare the entered password with the hashed password
    // const passwordMatch = await bcrypt.compare(password, user.password);
    // if (!passwordMatch) {
    //   return res.status(400).json({ message: 'Invalid credentials' });
    // }
    const gmailtoken = Math. floor(Math.random() * (999999)) + 1;

    //Send verification email
      SendMail(req.body.email, "Login Verification", gmailtoken)

    console.log("Logged in")
    const otpCreatedAt = new Date();
    db.query('UPDATE Users SET otp = ?, otp_created_at = ? WHERE email = ?', [gmailtoken, otpCreatedAt, email], (err) => {
      if (err) {
        console.error('Error updating user as verified:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }})
   return res.status(200).json({ message: 'Login successful', user: user });
  });
});

app.post('/api/profile', async (req, res) => {
  console.log("Trying to update user")
  const { username, email, phone, city } = req.body;
  const admin = 0;

  // Check if user already exists
  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (result.length == 0) {
      return res.status(400).json({ message: 'User does not exits' });
    }
  })
  console.log("2")


    // Insert the user into the database
    // db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
      // UPDATE `Users` SET `username`='[value-2]',`phone`='[value-4]',`city`='[value-5] WHERE 1
    db.query('UPDATE Users SET username = ? , phone = ? , city = ? WHERE email = ?', [username, phone, city, email], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Database error during registration' });
      }
      console.log("success")

      return res.status(200).json({ success: true, message: 'User Info edited successfully' });
    });
    console.log("3")
  });


  
app.post('/verify-otp', (req, res) => {
  let { email, otpCode } = req.body;

  // Query the database for the OTP associated with the email
  db.query('SELECT otp, otp_created_at FROM Users WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const { otp, otp_created_at } = result[0];

    // Check if the OTP has expired
    const now = new Date();
    const otpExpirationTime = new Date(otp_created_at);
    otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 5); // Assuming OTP valid for 5 minutes

    if (now > otpExpirationTime) {
      return res.status(400).json({ message: 'OTP has expired' });
    }
    console.log("otpCode")
    console.log(otpCode)
    console.log("type of otpCode")
    console.log(typeof otpCode)
    console.log("otp")
    console.log(otp)
    console.log("typeof otp")
    console.log(typeof otp)
    otpCode = parseInt(otpCode)
    console.log("otpCode")
    console.log(otpCode)
    console.log("type of otpCode")
    console.log(typeof otpCode)

    if (otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, update user as verified and clear OTP
    db.query('UPDATE Users SET otp = NULL, otp_created_at = NULL, is_verified = 1 WHERE email = ?', [email], (err) => {
      if (err) {
        console.error('Error updating user as verified:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.status(200).json({ message: 'OTP verified successfully, user is now verified.' });
    });
  });
});

app.use('/api', passwordReset);


// Starting server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
