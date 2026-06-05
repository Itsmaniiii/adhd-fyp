import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import initDb from "./src/db/initdb.js";
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import questionnaireRoutes from "./src/routes/questionnaireRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import predictionRoutes from "./src/routes/predictionRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/questionnaire", questionnaireRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", predictionRoutes);

app.get("/", (req, res) => res.send("ADHD FYP Backend running ✅"));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found", path: req.originalUrl });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start Logic
const PORT = process.env.PORT || 5001; // Change to 5001 to be safe

const startServer = async () => {
    try {
        console.log("⏳ Initializing Database...");
        await initDb();
        console.log("DB Connected ✅");

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is busy. Try a different port in .env`);
            } else {
                console.error("❌ Server Error:", err);
            }
        });

    } catch (err) {
        console.error("❌ DB init failed:", err);
        process.exit(1); 
    }
};

startServer();