import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.routes.js";
import leadsRouter from "./routes/leads.routes.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.use(express.json());
app.use(cors());

// This is applied beacause while deploying the app will be behind a proxy so in order to know the real IP address of the client this is used.
app.set('trust proxy', 1);

app.use("/api/chat", rateLimiter, chatRouter);
app.use("/api/leads", leadsRouter);

app.get("/health", (req, res) => {
    res.status(200).json({
        "message": "Backend is healthy",
        "status": "success"
    });
});

export default app;
