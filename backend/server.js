import { config } from "dotenv";
import connectToDb from "./utils/db.js";
import app from "./app.js";

config();

await connectToDb();

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on url: http://localhost:${process.env.PORT || 3000}`)
});