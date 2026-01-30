import express from "express";
import cors from "cors";
import initDb from "./src/db/initdb.js";
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import childRoutes from "./src/routes/childRoutes.js";
import geneticsRoutes from "./src/routes/geneticsRoutes.js";
import questionnaireRoutes from "./src/routes/questionnaireRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";


const app = express();
app.use(cors());
app.use(express.json());

initDb();

app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/child", childRoutes);
app.use("/api/genetics", geneticsRoutes);
app.use("/api/questionnaire", questionnaireRoutes);


app.use("/api", profileRoutes);

app.get("/", (req, res) => res.send("Backend running ✅"));

app.listen(5000, () => console.log("Server running on port 5000"));
