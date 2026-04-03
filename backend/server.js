import dotenv from "dotenv"; // 1. Must be the very first import
import express from "express";
import cors from "cors";
import initDb from "./src/db/initdb.js";

// Import Routes
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import childRoutes from "./src/routes/childRoutes.js";
import geneticsRoutes from "./src/routes/geneticsRoutes.js";
import questionnaireRoutes from "./src/routes/questionnaireRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";

// Initialize dotenv to read your .env file
dotenv.config();

const app = express();

// 2. Middleware
app.use(cors()); // Allows React (port 3000) to talk to Express (port 5000)
app.use(express.json()); // Parses incoming JSON payloads

// 3. Database Initialization
initDb();

// 4. API Routes
// Note: It's cleaner to keep all AI/Chat logic under /api/chat
app.use("/api", chatRoutes);           // Access via: /api/chat
app.use("/api/auth", authRoutes);      // Access via: /api/auth/...
app.use("/api/child", childRoutes);    // Access via: /api/child/...
app.use("/api/genetics", geneticsRoutes);
app.use("/api/questionnaire", questionnaireRoutes);
app.use("/api/profile", profileRoutes); // Changed from "/api" to "/api/profile" to avoid collisions


// 5. Health Check Root Route
app.get("/", (req, res) => {
    res.send("ADHD FYP Backend running ✅");
});

// 6. Error Handling Middleware (Optional but recommended)
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.stack);
    res.status(500).json({ error: "Something went wrong on the server!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    // Safety check for API Key
    if (!process.env.GROQ_API_KEY) {
        console.warn("⚠️ WARNING: GROQ_API_KEY is missing in your .env file!");
    }
});