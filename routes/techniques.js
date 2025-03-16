const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// 🟢 1. Get all techniques
router.get("/techniques", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM techniques ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching techniques." });
    }
});

// 🟢 2. Get a single technique by ID
router.get("/techniques/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM techniques WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Technique not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching technique." });
    }
});

router.post("/techniques/:id/save", authMiddleware, async (req, res) => {
    try {
        console.log("🔹 Middleware called. Decoding user..."); // ✅ Debugging
        console.log("Decoded User:", req.user); // ✅ Check if `req.user` exists

        const { id } = req.params;
        const user_id = req.user.id; // ✅ This should now exist

        console.log(`Saving technique ${id} for user ${user_id}`); // ✅ Debugging step

        await pool.query(
            "INSERT INTO user_favorites (user_id, technique_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [user_id, id]
        );

        res.json({ message: "Technique saved successfully!" });
    } catch (err) {
        console.error("Error saving technique:", err);
        res.status(500).json({ error: "Server error while saving technique." });
    }
});



// 🟢 7. Get all saved techniques for a user
router.get("/users/saved-techniques", authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            "SELECT t.* FROM techniques t JOIN user_favorites uf ON t.id = uf.technique_id WHERE uf.user_id = $1",
            [user_id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching saved techniques." });
    }
});


// ✅ Remove a technique from the authenticated user's saved library (Protected)
router.delete('/users/saved-techniques/:techniqueId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.savedTechniques = user.savedTechniques.filter(id => id.toString() !== req.params.techniqueId);
        await user.save();

        res.json({ message: 'Technique removed', savedTechniques: user.savedTechniques });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
