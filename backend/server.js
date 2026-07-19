// import { GoogleGenAI } from "@google/genai";
// import { config } from "dotenv";

// config();

// const aiInteraction = async () => {
//     const ai = new GoogleGenAI({
//         apiKey: process.env.GEMINI_API_KEY,
//     });

//     const response = await ai.models.generateContent({
//         model: "gemini-3.1-flash-lite-preview",  // verify exact string in AI Studio
//         contents: "Give be the slug for gemini 3.1 flash model to use in my gemini sdk",
//     });

//     console.log(response.text);
// }

// aiInteraction();