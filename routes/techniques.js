const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// get all techniques, paginated and optional search param
router.get("/techniques", async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;

        let query = `SELECT * FROM techniques ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
        let countQuery = `SELECT COUNT(*) FROM techniques`;
        let queryParams = [limit, offset];

        if (search.trim()) {  // ✅ If search is provided, modify query
            query = `SELECT * FROM techniques WHERE name ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
            countQuery = `SELECT COUNT(*) FROM techniques WHERE name ILIKE $1`;
            queryParams = [`%${search}%`, limit, offset];
        }

        const result = await pool.query(query, queryParams);
        const totalCount = await pool.query(countQuery, search.trim() ? [`%${search}%`] : []);

        res.json({
            total: parseInt(totalCount.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit),
            techniques: result.rows
        });
    } catch (err) {
        console.error("Error fetching techniques:", err);
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

router.delete("/users/saved-techniques/:techniqueId", authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.id;  // ✅ Ensure we correctly get user ID
        const { techniqueId } = req.params;

        console.log(`Removing technique ${techniqueId} for user ${user_id}`);  // ✅ Debugging step

        const result = await pool.query(
            "DELETE FROM user_favorites WHERE user_id = $1 AND technique_id = $2 RETURNING *",
            [user_id, techniqueId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Technique not found in saved list" });
        }

        res.json({ message: "Technique removed successfully!" });
    } catch (err) {
        console.error("Error removing technique:", err);
        res.status(500).json({ error: "Server error while removing technique." });
    }
});

router.get("/users/saved-techniques/:techniqueId", authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.id;
        const { techniqueId } = req.params;

        const result = await pool.query(
            "SELECT 1 FROM user_favorites WHERE user_id = $1 AND technique_id = $2",
            [user_id, techniqueId]
        );

        const isSaved = result.rowCount > 0;  // ✅ Check if the technique exists in saved list
        res.json({ saved: isSaved });
    } catch (err) {
        console.error("Error checking saved technique:", err);
        res.status(500).json({ error: "Server error while checking saved technique." });
    }
});


module.exports = router;
