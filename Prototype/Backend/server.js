require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 4000;

// Middleware

app.use(cors());
app.use(express.json());

// Image Upload Settings

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, callback) => {
        if (allowedTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error("Only JPG, PNG and WebP images are allowed."));
        }
    },
});

// Endpoint Test

app.get("/", (req, res) => {
    res.send("Backend is working.");
});

// Vehicle Image Recognition Endpoint

app.post("/api/recognise", upload.single("vehicle-image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: "No image uploaded.",
        });
    }

    try {
        // Sends image to Azure Custom Vision

        const response = await fetch(process.env.AZURE_PREDICTION_URL, {
            method: "POST",
            headers: {
                "Prediction-Key": process.env.AZURE_PREDICTION_KEY,
                "Content-Type": "application/octet-stream",
            },
            body: req.file.buffer,
        });

        if (!response.ok) {
            throw new Error(`Azure returned status ${response.status}`);
        }

        // Reads Azure's predictions

        const data = await response.json();

        console.log(data);

        // Sends predictions back to frontend

        res.json(data);
    } catch (error) {
        console.error("Azure prediction error:", error);

        res.status(500).json({
            error: "Vehicle recognition failed.",
        });
    }
});

// Error handler

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            error: "Image must be smaller than 10 MB.",
        });
    }

    if (err) {
        return res.status(400).json({
            error: err.message,
        });
    }

    next();
});

// Start server

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
