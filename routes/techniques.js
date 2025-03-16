const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// 🟢 1. Get all techniques
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM techniques ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching techniques." });
    }
});

// 🟢 2. Get a single technique by ID
router.get("/:id", async (req, res) => {
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

// 🟢 3. Add a new technique (Admin only)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, description, difficulty, category, video_url } = req.body;

        // Ensure only admins can add techniques
        if (!req.user || !req.user.is_admin) {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        const result = await pool.query(
            "INSERT INTO techniques (name, description, difficulty, category, video_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, description, difficulty, category, video_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while adding technique." });
    }
});

// 🟢 4. Update an existing technique (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, difficulty, category, video_url } = req.body;

        if (!req.user || !req.user.is_admin) {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        const result = await pool.query(
            "UPDATE techniques SET name = $1, description = $2, difficulty = $3, category = $4, video_url = $5 WHERE id = $6 RETURNING *",
            [name, description, difficulty, category, video_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Technique not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while updating technique." });
    }
});

// 🟢 5. Delete a technique (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || !req.user.is_admin) {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        const result = await pool.query("DELETE FROM techniques WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Technique not found" });
        }

        res.json({ message: "Technique deleted successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while deleting technique." });
    }
});

// 🟢 6. Save a technique as a favorite
router.post("/:id/save", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const result = await pool.query(
            "INSERT INTO user_favorites (user_id, technique_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *",
            [user_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(409).json({ error: "Technique is already saved." });
        }

        res.json({ message: "Technique saved successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while saving technique." });
    }
});

// 🟢 7. Get all saved techniques for a user
router.get("/favorites/list", authMiddleware, async (req, res) => {
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

module.exports = router;
