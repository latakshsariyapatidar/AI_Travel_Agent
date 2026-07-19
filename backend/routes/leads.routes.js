import express from 'express';
import { Lead } from '../models/Lead.model.js';
import { getLeadData } from '../services/data.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find({}).sort({ updatedAt: -1 }).lean();
        res.json({ leads });
    } catch (error) {
        console.error("Fetch leads failed:", error);
        res.status(500).json({ error: "Failed to fetch leads" });
    }
});

router.get('/:conversationId', async (req, res) => {
    try {
        const lead = await getLeadData(req.params.conversationId);
        res.json({ lead });
    } catch (error) {
        console.error("Fetch lead failed:", error);
        res.status(500).json({ error: "Failed to fetch lead" });
    }
});

export default router;