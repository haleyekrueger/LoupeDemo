const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ User Registration Route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        console.log("Received signup request:", username, email);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password:", hashedPassword);

        // Insert user into database
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error('Error signing up user:', err);
        res.status(500).json({ error: 'Server error during user registration.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("🔍 Received login request for:", email);

        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            console.log("❌ No user found with this email");
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        console.log("🛠 User found in DB:", user.rows[0]);

        // ✅ Ensure both password inputs are strings
        const storedPassword = String(user.rows[0].password);
        const inputPassword = String(password);

        console.log("🔑 Comparing passwords...");
        console.log("Stored Password (Hashed):", storedPassword);
        console.log("Input Password (Plain):", inputPassword);

        const isMatch = await bcrypt.compare(inputPassword, storedPassword);
        if (!isMatch) {
            console.log("❌ Password mismatch");
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: user.rows[0].id, email: user.rows[0].email, is_admin: user.rows[0].is_admin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log("✅ Login successful. Sending token...");
        res.json({ token });
    } catch (err) {
        console.error('❌ Error logging in user:', err);
        res.status(500).json({ error: 'Server error during login.' });
    }
});




// ✅ Protected Route Example
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the protected route!', user: req.user });
});


module.exports = router;
