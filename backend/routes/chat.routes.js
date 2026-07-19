import express from 'express';
import { callGemini } from '../services/gemini.service.js';
import { calculateScore } from '../services/score.service.js';
import { upsertConversation, upsertLeadDraft, upsertLead } from '../services/data.service.js';

const router = express.Router();

const DEFAULT_FIELDS = {
    destination: null,
    departureCity: null,
    travelDate: null,
    travellers: null,
    budget: null,
    duration: null,
    tripType: null,
    specialRequirements: null,
    name: null,
    phone: null,
    email: null
};

router.post('/', async (req, res) => {
    try {
        const { conversationId, messages = [], userMessage, summary = "" } = req.body;

        if (!conversationId || !userMessage) {
            return res.status(400).json({ error: "Missing conversationId or userMessage" });
        }

        const { reply, extractedFields } = await callGemini(messages, userMessage, summary);
        const fields = extractedFields || DEFAULT_FIELDS;
        const qual = calculateScore(fields);

        const updated = [
            ...messages,
            { role: 'user', content: userMessage },
            { role: 'model', content: reply }
        ];

        await upsertConversation(conversationId, updated, summary);
        await upsertLeadDraft(conversationId, fields, qual);

        let leadId = null;
        if (qual.leadReady) {
            const lead = await upsertLead(conversationId, fields, qual);
            leadId = lead._id;
        }

        res.json({
            reply,
            extractedFields: fields,
            qualification: qual,
            leadSaved: Boolean(leadId),
            leadId
        });

    } catch (error) {
        console.error("Chat endpoint failed:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;