const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const pool = require('./db');
const techniqueRoutes = require("./routes/techniques"); 

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Authentication Routes
app.use('/api/auth', authRoutes);

app.use("/api", techniqueRoutes); // Mounts routes under /api

// ✅ Server Health Check
app.get('/', (req, res) => {
    res.send('Loupe Backend is running...');
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
    try {
        await pool.connect();
        console.log(`✅ Server running on port ${PORT}`);
    } catch (err) {
        console.error('❌ Database connection failed:', err);
    }
});

