import { GoogleGenAI } from '@google/genai';
import { SystemPrompt } from '../prompts/systemPrompt.js';
import { summaryPrompt } from '../prompts/summaryPrompt.js';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const JSON_START = '|||JSON_START|||';
const JSON_END = '|||JSON_END|||';

export async function callGemini(messages, userMessage, summary = "") {
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
        let system = SystemPrompt;
        if (summary) {
            system += `\n\n--- PREVIOUS CONVERSATION SUMMARY ---\n${summary}\n----------------------------------`;
        }

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents,
            config: {
                systemInstruction: system,
                temperature: parseFloat(process.env.GEMINI_MODEL_TEMPERATURE),
            }
        });

        const raw = response.text;
        let reply = raw;
        let extractedFields = null;

        if (raw.includes(JSON_START) && raw.includes(JSON_END)) {
            reply = raw.substring(0, raw.indexOf(JSON_START)).trim();

            const start = raw.indexOf(JSON_START) + JSON_START.length;
            const end = raw.indexOf(JSON_END);
            const jsonStr = raw.substring(start, end).trim();

            try {
                extractedFields = JSON.parse(jsonStr).extractedFields || JSON.parse(jsonStr);
            } catch (err) {
                console.error("JSON parse failed:", err.message);
                console.error("Raw:", raw);
            }
        }

        return { reply, extractedFields };
    } catch (error) {
        console.error("Gemini call failed:", error.message);
        throw error;
    }
}

export async function generateHistorySummary(overflow, prevSummary = "") {
    const text = overflow.map(m => `${m.role}: ${m.content}`).join("\n");
    const prompt = `Previous: ${prevSummary}\n\nNew messages:\n${text}`;

    try {
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: prompt,
            config: {
                systemInstruction: summaryPrompt,
                temperature: 0.2
            }
        });

        return response.text.trim();
    } catch (err) {
        console.error("Summary call failed:", err.message);
        throw err;
    }
}