
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// AI routes
app.use("/api/ai", aiRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is working" });
});

// Serve React production build
const clientDistPath = path.resolve(__dirname, "../client/dist");

app.use(express.static(clientDistPath));

// React Router fallback
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
