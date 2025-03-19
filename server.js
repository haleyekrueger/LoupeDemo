const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const pool = require('./db');
const techniqueRoutes = require("./routes/techniques"); 
const s3Routes = require("./routes/s3Routes");

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Authentication Routes
app.use('/api/auth', authRoutes);

// Technique Routes
app.use("/api", techniqueRoutes); // Mounts routes under /api

// ✅ Mount the S3 routes
app.use("/api", s3Routes);

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

