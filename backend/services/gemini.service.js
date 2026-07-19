import { GoogleGenAI } from '@google/genai';
import { SystemPrompt } from '../prompts/systemPrompt.js';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const JSON_START = '|||JSON_START|||';
const JSON_END = '|||JSON_END|||';

export async function callGemini(messages, userMessage) {
    const recent = messages.slice(-8);

    const contents = recent.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }]
    }));

    contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });

    try {
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents,
            config: {
                systemInstruction: SystemPrompt,
                temperature: parseFloat(process.env.GEMINI_MODEL_TEMPERATURE),
            }
        });

        const raw = response.text;
        let reply = raw;
        let extractedFields = null;

        // Try to extract the JSON block if it's there
        if (raw.includes(JSON_START) && raw.includes(JSON_END)) {
            reply = raw.substring(0, raw.indexOf(JSON_START)).trim();

            const start = raw.indexOf(JSON_START) + JSON_START.length;
            const end = raw.indexOf(JSON_END);
            const jsonStr = raw.substring(start, end).trim();

            try {
                extractedFields = JSON.parse(jsonStr).extractedFields || JSON.parse(jsonStr);
            } catch (parseErr) {
                console.error("Couldn't parse JSON block:", parseErr.message);
                console.error("Raw:", raw);
            }
        } else {
            console.warn("No JSON markers found, model probably didn't format it right");
        }

        return { reply, extractedFields };
    } catch (error) {
        console.error("Gemini API call failed:", error.message);
        throw error;
    }
}