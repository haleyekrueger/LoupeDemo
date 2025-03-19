const express = require("express");
const AWS = require("aws-sdk");
require("dotenv").config();

const router = express.Router();

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

router.get("/generate-presigned-url", async (req, res) => {
    try {
        const { fileName, fileType } = req.query; // Get filename & type from the frontend

        console.log("📥 Received request for pre-signed URL");
        console.log("🔎 Query Params:", req.query);
        
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `patterns/${fileName}`, // Organize uploads into a "patterns" folder
            Expires: 300, // URL valid for 5 minutes (300 seconds)
            ContentType: fileType
        };

        // Generate pre-signed URL
        const uploadURL = await s3.getSignedUrlPromise("putObject", params);

        res.json({ uploadURL });
    } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        res.status(500).json({ error: "Error generating pre-signed URL" });
    }
});

module.exports = router;
