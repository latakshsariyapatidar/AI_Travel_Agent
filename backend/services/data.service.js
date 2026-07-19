import { Lead } from '../models/Lead.model.js';
import { LeadDraft } from '../models/LeadDraft.model.js';
import { Conversation } from '../models/Conversation.model.js';
import { generateHistorySummary } from './gemini.service.js';

/**
 * Maps flat extracted fields to the nested schema structure
 * expected by Mongoose for Lead and LeadDraft.
 */

function mapToSchemaData(extractedFields, qualification) {
    return {
        customer: {
            name: extractedFields.name || null,
            phone: extractedFields.phone || null,
            email: extractedFields.email || null,
        },
        travel: {
            destination: extractedFields.destination || null,
            departureCity: extractedFields.departureCity || null,
            travelDate: extractedFields.travelDate || null,
            travellers: extractedFields.travellers || null,
            budget: extractedFields.budget || null,
            duration: extractedFields.duration || null,
            tripType: extractedFields.tripType || null,
            specialRequirements: extractedFields.specialRequirements || null,
        },
        qualification: {
            leadScore: qualification?.leadScore || 0,
            confidence: qualification?.confidence || 'Low',
            reason: qualification?.reason || '',
            summary: qualification?.summary || '',
        }
    };
}

/**
 * Always called every turn. Updates the partial lead state in the draft collection.
 */
export async function upsertLeadDraft(conversationId, extractedFields, qualification) {
    const data = mapToSchemaData(extractedFields, qualification);
    return await LeadDraft.findOneAndUpdate(
        { conversationId },
        { $set: data },
        { upsert: true, new: true }
    );
}

/**
 * Called only when leadReady === true (score >= 65, name & phone present).
 * Saves the fully qualified lead to the main leads collection.
 */
export async function upsertLead(conversationId, extractedFields, qualification) {
    const data = mapToSchemaData(extractedFields, qualification);
    
    return await Lead.findOneAndUpdate(
        { conversationId },
        { $set: data },
        { upsert: true, new: true }
    );
}

/**
 * Always called every turn. Trims history to last 8 messages and upserts the conversation record.
 */
export async function upsertConversation(conversationId, messages, previousSummary = "") {
    const trimmedHistory = messages.slice(-8);
    
    if (messages.length > 8) {
        const overflowMessages = messages.slice(0, -8);
        
        // It runs asynchronously so we don't block the user's chat reply.
        generateHistorySummary(overflowMessages, previousSummary)
            .then(async (newSummary) => {
                await Conversation.findOneAndUpdate(
                    { conversationId },
                    { $set: { summary: newSummary } },
                    { upsert: true }
                );
            })
            .catch(err => {
                console.error("Background summary generation failed:", err.message);
            });
    }

    return await Conversation.findOneAndUpdate(
        { conversationId },
        { 
            $set: { history: trimmedHistory } 
        },
        { upsert: true, new: true }
    );
}

/**
 * Checks `lead_drafts` by conversationId. 
 * If it's fully qualified, checks `leads` and returns the richer record.
 */
export async function getLeadData(conversationId) {
    const draft = await LeadDraft.findOne({ conversationId }).lean();
    if (!draft) return null;
    
    const lead = await Lead.findOne({ conversationId }).lean();
    const result = lead ? lead : draft;
    
    const conversation = await Conversation.findOne({ conversationId }).lean();
    if (conversation && conversation.history) {
        result.history = conversation.history;
    }
    
    return result; 
}
