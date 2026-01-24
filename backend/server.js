import express from "express";
import cors from "cors";
import initDb from "./src/db/initdb.js";
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";


const app = express();
app.use(cors());
app.use(express.json());

initDb();

app.use("/api/auth", authRoutes);

app.use("/api", profileRoutes);

app.get("/", (req, res) => res.send("Backend running ✅"));

app.listen(5000, () => console.log("Server running on port 5000"));
