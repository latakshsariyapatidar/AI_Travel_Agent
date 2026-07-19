import { config } from "dotenv";
import express from "express";
import connectToDb from "./utils/db.js";
import cors from "cors";

config();


const app = express();

app.use(express.json());
app.use(cors());

await connectToDb();

app.get("/health", (req, res) => {
    res.status(200).json({
        "message": "Backend is healthy",
        "status": "success"
    });
});


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on url: http://localhost:${process.env.PORT || 3000}`)
});