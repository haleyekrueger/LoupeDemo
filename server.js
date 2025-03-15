const express = require('express');
const app = express();
const pool = require('./db');
require('dotenv').config();

// Middleware
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Protected Route
const authenticateToken = require('./middleware/authMiddleware'); // Import middleware

app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: "Welcome to the protected route!" });
});


// Only start the server if NOT in test mode
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
}

// Export `app` for Jest testing
module.exports = app;
