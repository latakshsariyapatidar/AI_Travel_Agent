import { config } from "dotenv";
import express from "express";
import connectToDb from "./utils/db.js";
import cors from "cors";
import chatRouter from "./routes/chat.routes.js";

config();


const app = express();

app.use(express.json());
app.use(cors());

// This is applied beacause while deploying the app will be behind a proxy so in order to know the real IP address of the client this is used.
app.set('trust proxy', 1);


await connectToDb();

app.use("/api/chat", chatRouter);

app.get("/health", (req, res) => {
    res.status(200).json({
        "message": "Backend is healthy",
        "status": "success"
    });
});




app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on url: http://localhost:${process.env.PORT || 3000}`)
});