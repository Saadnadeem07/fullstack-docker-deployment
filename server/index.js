import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
// Configure CORS to allow requests coming from specific frontend URLs
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      // Frontend development servers (Vite): 5173, 5174
      // Local testing server (e.g., serve package): 3000
    ],
    credentials: true, // Allow cookies, sessions, and auth headers
  })
);

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from Server" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT http://localhost:${PORT}`);
});
