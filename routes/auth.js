const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Import database connection
require('dotenv').config();

const router = express.Router();

// User Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password before storing in database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into database
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashedPassword]
        );

        res.json(newUser.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
